type SectionPageProps = {
  title: string;
  text?: string;
};

export default function SectionPage({ title, text }: SectionPageProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">{title}</h1>
      {text ? <p className="mt-4 max-w-3xl text-base text-neutral-700">{text}</p> : null}
    </section>
  );
}
