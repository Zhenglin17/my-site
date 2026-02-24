import Link from "next/link";
import Particles from "./components/particles";

const navigation = [
  { name: "Discover my life", href: "/projects" },
  { name: "if you are a brief guy", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-[#b8902a] via-[#c49a3c]/60 to-[#bf8c20]">
      <nav className="my-16">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-stone-500 hover:text-stone-800"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />

      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-stone-800 cursor-default font-display sm:text-5xl md:text-7xl whitespace-nowrap">
        Zhenglin Zhang
      </h1>

      <div className="my-16 text-center">
        <h2 className="text-sm text-stone-500">
          Software Engineer
        </h2>
      </div>
    </div>
  );
}
