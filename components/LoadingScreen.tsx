import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black px-6">
      <Image
        src="/SonderwunschW.png"
        alt="Sonderwunsch Logo"
        width={240}
        height={120}
        priority
        className="h-auto w-[220px] max-w-[70vw]"
      />
      <div
        aria-label="Ladezustand"
        className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
      />
    </div>
  );
}
