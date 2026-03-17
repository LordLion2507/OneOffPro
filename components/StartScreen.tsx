import Image from 'next/image';
import HomeCard from '@/components/HomeCard';

const CARD_ITEMS = [
  {
    title: 'Companion',
    description:
      'Werkzeuge zur Unterstützung der Kundenkommunikation und Verwaltung relevanter Informationen.',
    image: '/Kunde.jpg',
    href: '/companion',
  },
  {
    title: 'Slotplanung / MPÜ',
    description:
      'Planung und Organisation von Projekt-Slots sowie Visualisierung der Projektstruktur.',
    image: '/Slots.jpg',
    href: '/slotplanung',
  },
  {
    title: 'Projektübersicht',
    description:
      'Zentrale Übersicht über Projektinformationen, Dokumente und Kalkulationen.',
    image: '/Projekte.jpg',
    href: '/projektuebersicht',
  },
];

export default function StartScreen() {
  return (
    <main className="relative min-h-screen bg-[url('/Trazzi.jpeg')] bg-cover bg-center bg-no-repeat bg-fixed px-4 py-12 sm:px-8">
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center pt-12 pb-8 sm:pt-16 md:pt-20">
        <Image
          src="/SonderwunschW.png"
          alt="Sonderwunsch Logo"
          width={1200}
          height={470}
          priority
          className="h-auto w-[min(86vw,820px)]"
        />

        <Image
          src="/One.png"
          alt="ONE"
          width={900}
          height={260}
          priority
          className="mt-12 h-auto w-[min(70vw,520px)] sm:mt-16 md:mt-20"
        />

        <p className="mt-10 max-w-4xl text-center text-sm leading-7 text-white/95 sm:text-base md:text-lg">
          ONE ist ein internes Tool für den Bereich Sonderwunsch. Es bündelt bisher getrennte
          Arbeitsmittel in einer zentralen Web-Anwendung, verbessert Transparenz und Effizienz im
          Arbeitsfluss und ermöglicht eine strukturierte Verwaltung von Daten, Dokumenten und
          Kostenübersichten innerhalb des Porsche-internen Netzwerks.
        </p>

        <section className="mt-20 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {CARD_ITEMS.map((item) => (
            <HomeCard
              key={item.href}
              title={item.title}
              description={item.description}
              image={item.image}
              href={item.href}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
