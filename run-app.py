#!/usr/bin/env python3
"""
Cloudera AI Workbench application entrypoint for a Next.js project.

Behavior:
1) Detect project root (must contain package.json with npm scripts).
2) Ensure Node.js/NPM are available (install via install_nodejs.sh when needed).
3) Install dependencies.
4) Run production build.
5) Start Next.js on CDSW_APP_PORT.
"""

import json
import os
import shlex
import subprocess
import sys
from typing import Dict, List


def log(message: str) -> None:
    print("[run-app] {0}".format(message), flush=True)


def fail(message: str, code: int = 1) -> None:
    log("ERROR: {0}".format(message))
    sys.exit(code)


def run_command(command: str, cwd: str, extra_env: Dict[str, str] = None) -> None:
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)

    log("Executing: {0}".format(command))
    process = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        env=env,
        executable="/bin/bash",
    )
    return_code = process.wait()
    if return_code != 0:
        fail("Command failed ({0}): {1}".format(return_code, command), return_code)


def run_capture(command: str, cwd: str) -> str:
    process = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        executable="/bin/bash",
        text=True,
    )
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        log("Capture command failed: {0}".format(command))
        if stderr:
            log(stderr.strip())
        return ""
    return stdout.strip()


def read_json(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def has_dev_script(project_root: str) -> bool:
    package_json_path = os.path.join(project_root, "package.json")
    if not os.path.isfile(package_json_path):
        return False
    try:
        package_json = read_json(package_json_path)
    except Exception as exc:  # pragma: no cover - defensive
        fail("Could not parse package.json ({0}): {1}".format(package_json_path, exc))
    scripts = package_json.get("scripts", {})
    return isinstance(scripts, dict) and "dev" in scripts and "build" in scripts and "start" in scripts


def validate_project_files(project_root: str) -> None:
    required_files = ["package.json"]
    missing_files = [
        file_name for file_name in required_files if not os.path.isfile(os.path.join(project_root, file_name))
    ]
    if missing_files:
        fail("Missing required project files: {0}".format(", ".join(missing_files)))


def discover_project_root() -> str:
    candidates: List[str] = []
    if "PROJECT_ROOT" in os.environ:
        candidates.append(os.environ["PROJECT_ROOT"])
    candidates.append(os.getcwd())
    candidates.append(os.path.dirname(os.path.abspath(__file__)))
    candidates.append("/home/cdsw")

    visited = set()
    for candidate in candidates:
        if not candidate:
            continue
        absolute_candidate = os.path.abspath(candidate)
        if absolute_candidate in visited:
            continue
        visited.add(absolute_candidate)

        if has_dev_script(absolute_candidate):
            return absolute_candidate

        # One level deep search catches common "project/project-app" layouts.
        try:
            for entry in os.listdir(absolute_candidate):
                nested = os.path.join(absolute_candidate, entry)
                if os.path.isdir(nested) and has_dev_script(nested):
                    return nested
        except Exception:
            continue

    fail("Could not find a Next.js project root with package.json scripts (dev/build/start).")
    return ""


def node_available(project_root: str) -> bool:
    node_version = run_capture("node -v", project_root)
    npm_version = run_capture("npm -v", project_root)
    if node_version and npm_version:
        log("Node available: {0}".format(node_version))
        log("NPM available: {0}".format(npm_version))
        return True
    return False


def get_node_major(project_root: str) -> int:
    version_text = run_capture("node -v", project_root)
    if not version_text:
        return 0
    normalized = version_text.lstrip("v")
    first = normalized.split(".", 1)[0]
    try:
        return int(first)
    except ValueError:
        return 0


def ensure_node(project_root: str) -> None:
    if node_available(project_root):
        node_major = get_node_major(project_root)
        if node_major >= 20:
            return
        log("Node major version {0} detected; upgrading to >=20 for Next.js 16 compatibility.".format(node_major))

    installer = os.path.join(project_root, "install_nodejs.sh")
    if not os.path.isfile(installer):
        fail("Node is missing and installer script not found: {0}".format(installer))

    run_command("chmod +x {0}".format(shlex.quote(installer)), project_root)
    run_command("bash {0}".format(shlex.quote(installer)), project_root)

    if not node_available(project_root):
        fail("Node/NPM are still unavailable after install_nodejs.sh.")


def npm_install_and_build(project_root: str) -> None:
    lock_file = os.path.join(project_root, "package-lock.json")
    # Use login shell so nvm-based node is available in PATH if installed.
    if os.path.isfile(lock_file):
        install_chain = "npm ci || npm install"
    else:
        install_chain = "npm install"

    run_command("source ~/.nvm/nvm.sh >/dev/null 2>&1 || true; {0}".format(install_chain), project_root)
    run_command("source ~/.nvm/nvm.sh >/dev/null 2>&1 || true; npm run build", project_root)


def start_next_app(project_root: str) -> None:
    app_port = os.environ.get("CDSW_APP_PORT", "3000")
    host = os.environ.get("CDSW_APP_ADDRESS") or os.environ.get("CDSW_APP_HOST") or "127.0.0.1"
    if not host:
        host = "127.0.0.1"

    log("Starting app on host={0}, port={1}".format(host, app_port))
    env = {
        "PORT": str(app_port),
        "HOSTNAME": str(host),
        "NODE_ENV": "production",
    }
    # Keep foreground process alive for Cloudera application runtime.
    run_command(
        "source ~/.nvm/nvm.sh >/dev/null 2>&1 || true; npm run start -- --port {0} --hostname {1}".format(
            shlex.quote(str(app_port)),
            shlex.quote(str(host)),
        ),
        project_root,
        extra_env=env,
    )


def main() -> None:
    log("Discovering project root...")
    project_root = discover_project_root()
    log("Project root: {0}".format(project_root))
    validate_project_files(project_root)

    package_json = read_json(os.path.join(project_root, "package.json"))
    log("Detected project: {0}".format(package_json.get("name", "<unknown>")))
    log("Detected scripts: {0}".format(", ".join(sorted(package_json.get("scripts", {}).keys()))))

    ensure_node(project_root)
    npm_install_and_build(project_root)
    start_next_app(project_root)


if __name__ == "__main__":
    main()
