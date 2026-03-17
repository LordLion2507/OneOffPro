import Image from 'next/image';

export default function CustomerLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Image
        src="/SonderwunschW.png"
        alt="Sonderwunsch Logo"
        width={280}
        height={120}
        priority
        className="h-auto w-[240px] max-w-[70vw]"
      />
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
    </div>
  );
}
