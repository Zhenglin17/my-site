import Link from "next/link";
import Particles from "./components/particles";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <nav className="mb-14">
        <ul className="flex items-start justify-center gap-12">

          {/* TL;DR */}
          <li>
            <Link
              href="/tldr"
              className="group/tldr flex flex-col items-center gap-1
                         transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="text-sm text-stone-500 transition-colors duration-300
                               group-hover/tldr:text-stone-800">
                TL;DR
              </span>
              <span className="text-[11px] leading-tight text-stone-400 transition-colors duration-300
                               group-hover/tldr:text-stone-600">
                Short on time? Quick version.
              </span>
            </Link>
          </li>

          {/* Full Story */}
          <li>
            <Link
              href="/story"
              className="group/story flex flex-col items-center gap-1
                         transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="text-sm text-stone-500 transition-colors duration-300
                               group-hover/story:text-stone-800">
                Full Story
              </span>
              <span className="text-[11px] leading-tight text-stone-400 transition-colors duration-300
                               group-hover/story:text-stone-600">
                Discover the whole journey.
              </span>
            </Link>
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
