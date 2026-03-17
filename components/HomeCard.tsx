import Image from 'next/image';
import Link from 'next/link';

type HomeCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function HomeCard({ title, description, image, href }: HomeCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_18px_35px_rgba(0,0,0,0.2)]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      <div className="bg-neutral-200 px-5 py-4 text-center">
        <h3 className="text-xl font-bold text-black">{title}</h3>
      </div>

      <div className="px-6 py-5 text-center">
        <p className="text-sm leading-6 text-black/85">{description}</p>
      </div>
    </Link>
  );
}
