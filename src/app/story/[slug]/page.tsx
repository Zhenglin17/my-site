import { notFound } from "next/navigation";
import { Navigation } from "../../components/nav";
import { EVENTS } from "../events";

type StoryContent = {
  title: string;
  body: string[];
};

// Long-form content for deep events. Keyed by slug. Replace placeholders with
// real writing as you go — the event metadata (age, altitude, short label)
// still lives in events.ts and is read below.
const STORIES: Record<string, StoryContent> = {
  "math-olympiad": {
    title: "First in the City Math Olympiad",
    body: [
      "Placeholder — write the fuller story here. What it felt like the morning of the final round, who drove you there, what problem broke your brain in the best way.",
      "Two or three paragraphs is plenty. Keep it conversational.",
    ],
  },
  "phd-pause": {
    title: "Stepping Away from the PhD",
    body: [
      "Placeholder — the version of this that's honest but not dramatic. Why UMD, what changed, the conversation where you decided.",
      "It's okay to leave some things vague. The point is to let the reader feel the weight, not to justify.",
    ],
  },
  "race-car": {
    title: "Built an E36 M3 from a Frame",
    body: [
      "Placeholder — the garage, the parts box, the night you got the engine to turn over for the first time. What the project was really about.",
      "Drop in photos later via the same per-item pattern we use on /tldr.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(STORIES).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const story = STORIES[slug];
  return { title: story ? story.title : "Story" };
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = STORIES[slug];
  if (!story) notFound();

  const event = EVENTS.find((e) => e.slug === slug);

  return (
    <div className="relative min-h-screen">
      <Navigation backHref="/story" />
      <article className="container mx-auto px-4 sm:px-8 pt-20 pb-20 max-w-2xl">
        <header className="mb-8">
          {event && (
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono mb-3">
              age {event.age} · altitude {event.altitude}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl font-display text-stone-800 mb-2">
            {story.title}
          </h1>
          {event && (
            <p className="text-sm text-stone-500 italic">{event.label}</p>
          )}
        </header>

        <div className="space-y-5">
          {story.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-stone-700">
              {p}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
