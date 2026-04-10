import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "../components/nav";
import { items, ExperienceItem } from "./data";

const CLICKABLE_SLUGS = new Set(["normal-flow", "feature-matching"]);

// Left column: NF → FC → BG   |   Right column: FM → SOLO → MS
const COL1_SLUGS = ["normal-flow", "fruit-counting", "block-grabbing"];
const COL2_SLUGS = ["feature-matching", "solo", "microsoft"];
const ALL_SLUGS   = ["normal-flow", "feature-matching", "fruit-counting", "solo", "block-grabbing", "microsoft"];

const SKILLS = [
  "Python", "PyTorch", "NumPy", "C", "Linux", "Git", "MATLAB",
  "Computer Vision", "Deep Learning", "Robotics", "Sensor Fusion", "3D Vision",
];

function ClickableCard({ item }: { item: ExperienceItem }) {
  return (
    <Link
      href={`/tldr/${item.slug}`}
      className="group flex flex-col border border-stone-200 rounded-lg p-4
                 hover:border-stone-500 hover:bg-stone-50 hover:shadow-sm
                 duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-stone-800 font-medium text-sm leading-snug">{item.title}</span>
        <ArrowUpRight
          size={15}
          className="shrink-0 mt-0.5 text-stone-300 group-hover:text-stone-600
                     group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                     duration-200 transition-transform"
        />
      </div>
      <p className="text-stone-400 text-xs mb-2">{item.period}</p>
      <p className="text-stone-500 text-xs leading-relaxed flex-1">{item.summary}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-stone-100 group-hover:bg-stone-200
                       text-stone-500 rounded-full duration-200"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs text-stone-400 group-hover:text-stone-600 mt-3
                    opacity-0 group-hover:opacity-100 duration-200">
        View details →
      </p>
    </Link>
  );
}

function StaticCard({ item }: { item: ExperienceItem }) {
  return (
    <div className="flex flex-col border border-stone-100 rounded-lg p-4 bg-stone-50/40">
      <span className="text-stone-700 font-medium text-sm leading-snug mb-0.5">{item.title}</span>
      <p className="text-stone-400 text-xs mb-1">
        {item.period} · {item.location}
      </p>
      <p className="text-xs text-stone-400 italic mb-2">{item.subtitle}</p>

      <ul className="space-y-2 mb-3">
        {item.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-stone-300" />
            <p className="text-xs text-stone-500 leading-relaxed">{bullet}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1 mt-auto">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-400 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {item.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {item.links.map((link) => (
            <a
              key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              className="text-xs text-stone-400 hover:text-stone-700 duration-200 underline underline-offset-2"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ item }: { item: ExperienceItem }) {
  return CLICKABLE_SLUGS.has(item.slug)
    ? <ClickableCard item={item} />
    : <StaticCard item={item} />;
}

export default function TldrPage() {
  const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  const col1 = COL1_SLUGS.map((s) => bySlug[s]);
  const col2 = COL2_SLUGS.map((s) => bySlug[s]);
  const allOrdered = ALL_SLUGS.map((s) => bySlug[s]);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-6 sm:px-8 pt-28 pb-16 max-w-6xl">
        <div className="lg:grid lg:grid-cols-[5fr_7fr] lg:gap-16 space-y-12 lg:space-y-0">

          {/* ── LEFT: Narrative + Skills ───────────────────── */}
          <div className="flex flex-col gap-10">

            <div>
              <h1 className="text-3xl font-display text-stone-800 mb-2">Zhenglin Zhang</h1>
              <div className="flex flex-col gap-1 text-sm">
                <a href="mailto:zhenglinzhang6@gmail.com"
                   className="text-stone-500 hover:text-stone-800 duration-200 w-fit">
                  zhenglinzhang6@gmail.com
                </a>
                <a href="https://github.com/Zhenglin17" target="_blank"
                   className="text-stone-500 hover:text-stone-800 duration-200 w-fit">
                  github.com/Zhenglin17
                </a>
              </div>
            </div>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Narrative</h2>
              <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                <p>
                  From elementary school, I was on the olympiad math circuit — eight or nine
                  competitions a year, first prize in seven of them. Looking back, I&rsquo;m not
                  sure what the point was beyond training logical thinking. I genuinely wish I
                  had spent more of that time building real interests. That absence set the tone
                  for the years ahead. Middle school was more of the same. In 8th grade, I won
                  first prize at the Math League — a 9th-grade competition. Then in high school,
                  I made the provincial team for the{" "}
                  <span className="text-stone-800 font-medium">National Physics Olympiad</span>.
                  More firsts, same pattern.
                </p>
                <p>
                  I studied Theoretical and Applied Mechanics at{" "}
                  <span className="text-stone-800 font-medium">Peking University</span> as an
                  Outstanding Graduate, then pursued a Master&rsquo;s in Robotics at{" "}
                  <span className="text-stone-800 font-medium">UPenn</span> — my first real
                  exposure to computer vision and 3D vision, which came comparatively late. Then
                  I began a PhD in Computer Science at{" "}
                  <span className="text-stone-800 font-medium">UMD</span>, which I stepped away
                  from after half a year. Maybe that outcome was set long before — back in
                  elementary school, the first time I optimized for a metric without asking why.
                </p>
                <p>
                  This past year, I&rsquo;ve been building things just to explore them. A few
                  friends and I assembled an{" "}
                  <span className="text-stone-800 font-medium">E36 M3 race car from a bare frame</span>
                  , then ran an endurance race at NJMP. I spent months deep in trading — my
                  account fell 60% in one month, then climbed back 50% in three weeks. Exploring
                  some simple quantitative and automated methods — still aggressive, but I think
                  life is more about experience than optimization.
                </p>
                <p>
                  Maybe it was when I worked on the car until my back was about to give out, or
                  when I was so exhausted while driving that I nearly fell asleep, or when
                  trading led me to pay close attention to macroeconomics, technological shifts,
                  and the evolution of companies — this is when I truly realized that some things
                  are already reshaping the world quietly but fundamentally. Sometimes I look
                  around at people on the street — happy, relaxed — as if none of these changes
                  affect them. Yet the very skills they are most proud of today may be replaced
                  in the near future.
                </p>
                <p className="text-stone-700">
                  I&rsquo;m back now — with more clarity and motivation than I&rsquo;ve ever had.{" "}
                  <span className="font-medium">The search continues.</span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span key={skill}
                        className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Experience ──────────────────────────── */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Experience</h2>

            {/* Mobile: single ordered column */}
            <div className="flex flex-col gap-3 sm:hidden">
              {allOrdered.map((item) => <Card key={item.slug} item={item} />)}
            </div>

            {/* Desktop: two flex columns — no grid gaps */}
            <div className="hidden sm:flex gap-3 items-start">
              <div className="flex flex-col gap-3 flex-1">
                {col1.map((item) => <Card key={item.slug} item={item} />)}
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {col2.map((item) => <Card key={item.slug} item={item} />)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
