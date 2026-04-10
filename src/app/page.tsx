import Link from "next/link";
import Particles from "./components/particles";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <nav className="mb-14">
        <ul className="flex items-center justify-center gap-8">

          {/* TL;DR */}
          <li className="relative group/tldr">
            <Link
              href="/tldr"
              className="text-sm duration-300 text-stone-500 hover:text-stone-800
                         hover:-translate-y-0.5 inline-block transition-transform"
            >
              TL;DR
            </Link>
            <div
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                         opacity-0 group-hover/tldr:opacity-100 transition-opacity duration-200
                         bg-stone-800 text-white text-xs rounded-lg px-3 py-2 w-44 text-center
                         leading-snug shadow-lg whitespace-normal"
            >
              Short on time? This is the quick version.
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
            </div>
          </li>

          {/* Full Story */}
          <li className="relative group/story">
            <Link
              href="/story"
              className="text-sm duration-300 text-stone-500 hover:text-stone-800
                         hover:-translate-y-0.5 inline-block transition-transform"
            >
              Full Story
            </Link>
            <div
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                         opacity-0 group-hover/story:opacity-100 transition-opacity duration-200
                         bg-stone-800 text-white text-xs rounded-lg px-3 py-2 w-48 text-center
                         leading-snug shadow-lg whitespace-normal"
            >
              Want to see more? Discover the whole story here.
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
            </div>
          </li>

        </ul>
      </nav>

      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />

      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-stone-800 cursor-default font-display sm:text-5xl md:text-7xl whitespace-nowrap">
        Zhenglin Zhang
      </h1>

      {/* Balancing spacer — mirrors nav height so name sits at true vertical center */}
      <div className="mt-14" aria-hidden="true" />
    </div>
  );
}
