'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar, { type MenuKey, type NavItem } from '@/components/Navbar';
import { projects } from '@/data/projects';

export default function Headbar() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<MenuKey | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const raw = window.localStorage.getItem('favoriteProjectIds');
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      const valid = new Set(projects.map((project) => project.projectId));
      return parsed.filter((projectId) => valid.has(projectId));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('favoriteProjectIds', JSON.stringify(favoriteProjectIds));
  }, [favoriteProjectIds]);

  const toggleFavorite = useCallback((projectId: string) => {
    setFavoriteProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  }, []);

  const navItems = useMemo<NavItem[]>(() => {
    const favorites = projects.filter((project) => favoriteProjectIds.includes(project.projectId));
    const nonFavorites = projects.filter((project) => !favoriteProjectIds.includes(project.projectId));
    const sortedProjects = [...favorites, ...nonFavorites];
    const quickAccessItems = sortedProjects.map((project) => ({
      label: project.projectId,
      href: `/projektuebersicht/cockpit/${project.projectId}`,
      projectId: project.projectId,
      isFavorite: favoriteProjectIds.includes(project.projectId),
      onToggleFavorite: toggleFavorite,
    }));

    return [
      {
        kind: 'link' as const,
        key: 'companion',
        label: 'Companion',
        href: '/companion',
      },
      {
        kind: 'menu' as const,
        key: 'slotplanung',
        label: 'Slotplanung / MPÜ',
        items: [
          { label: 'Management Summary / Slotplanung', href: '/slotplanung' },
          { label: 'MPÜ', href: '/mpue' },
        ],
      },
      {
        kind: 'link' as const,
        key: 'projektuebersicht',
        label: 'Projektübersicht',
        href: '/projektuebersicht',
      },
      {
        kind: 'menu' as const,
        key: 'schnellzugriff',
        label: 'Schnellzugriff',
        items: quickAccessItems,
      },
    ];
  }, [favoriteProjectIds, toggleFavorite]);

  const closeAllMenus = () => {
    setOpenMenu(null);
    setPinnedMenu(null);
  };

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  const handleHoverOpen = (key: MenuKey) => {
    if (!pinnedMenu) {
      setOpenMenu(key);
    }
  };

  const handleHoverClose = () => {
    if (!pinnedMenu) {
      setOpenMenu(null);
    }
  };

  const handleMenuClick = (key: MenuKey) => {
    setPinnedMenu((currentPinned) => {
      const nextPinned = currentPinned === key ? null : key;
      setOpenMenu(nextPinned);
      return nextPinned;
    });
  };

  return (
    <header className="sticky top-0 z-50">
      <div
        ref={wrapperRef}
        className="relative mx-auto h-24 w-full max-w-[1500px] px-4 pt-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label="Zur Startseite"
          className="absolute left-4 top-5 inline-flex items-center sm:left-6"
          onClick={closeAllMenus}
        >
          <Image
            src="/SonderwunschB.png"
            alt="Sonderwunsch Logo"
            width={155}
            height={58}
            priority
            className="h-auto w-[130px] sm:w-[155px]"
          />
        </Link>

        <div className="absolute left-1/2 top-3 -translate-x-1/2">
          <Navbar
            items={navItems}
            openMenu={openMenu}
            onHoverOpen={handleHoverOpen}
            onHoverClose={handleHoverClose}
            onClickMenu={handleMenuClick}
            onItemClick={closeAllMenus}
          />
        </div>
      </div>
    </header>
  );
}
