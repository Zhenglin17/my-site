import Image from "next/image";
import { notFound } from "next/navigation";
import { Navigation } from "../../components/nav";
import { items } from "../data";

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const LOCAL_MEDIA: Record<
  string,
  {
    localImages?: { src: string; alt: string; label: string; caption: string }[];
    videos?: { src: string; label: string; caption: string }[];
  }
> = {
  "normal-flow": {
    videos: [
      {
        src: "/media/normal-flow/video1.mp4",
        label: "Demo 1",
        caption: "Normal flow estimation on event camera sequence.",
      },
      {
        src: "/media/normal-flow/video2.mp4",
        label: "Demo 2",
        caption: "Ego-motion estimation with IMU fusion — stabilized camera trajectory.",
      },
      {
        src: "/media/normal-flow/video3.mp4",
        label: "Demo 3",
        caption: "Comparison: classical baseline vs. learning-based normal flow.",
      },
    ],
  },
  "feature-matching": {
    localImages: [
      {
        src: "/media/dsec/colmap.png",
        alt: "3D reconstruction via COLMAP",
        label: "3D Reconstruction",
        caption:
          "3D point cloud via COLMAP — used as ground truth for supervising the keypoint matching network.",
      },
      {
        src: "/media/dsec/compare.png",
        alt: "Feature matching comparison",
        label: "Comparison",
        caption:
          "Single mono frame feature matching — model output vs. baseline under challenging lighting.",
      },
      {
        src: "/media/dsec/result.png",
        alt: "Feature matching result",
        label: "Result",
        caption:
          "Qualitative matching result on DSEC event frames — keypoint correspondences overlaid on image pairs.",
      },
    ],
    videos: [
      {
        src: "/media/dsec/test_background.mp4",
        label: "Background Sequence",
        caption:
          "Feature matching on a background-dominated sequence — robustness under low-motion conditions.",
      },
      {
        src: "/media/dsec/test.mp4",
        label: "Motion Sequence",
        caption:
          "Feature matching on a dynamic sequence — performance under motion blur and rapid scene change.",
      },
    ],
  },
};

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();

  const media = LOCAL_MEDIA[slug] ?? {};

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">

        {/* ── Header ── */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-stone-400">{item.category}</span>
          <h1 className="text-2xl font-display text-stone-800 mt-2 mb-1 leading-snug">
            {item.title}
          </h1>
          <p className="text-stone-500 text-sm">{item.subtitle}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
            <span>{item.period}</span>
            <span>·</span>
            <span>{item.location}</span>
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {item.tags.map((tag) => (
            <span key={tag}
                  className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* ── Bullet points ── */}
        <section className="mb-10">
          <ul className="space-y-4">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-stone-300" />
                <p className="text-stone-600 text-sm leading-relaxed">{bullet}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Local images (results) — shown before videos ── */}
        {media.localImages && media.localImages.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-6">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {media.localImages.map((img) => (
                <div key={img.src}>
                  <p className="text-xs font-medium text-stone-500 mb-2">{img.label}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto rounded-md"
                  />
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">{img.caption}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Videos — autoplay, loop, muted ── */}
        {media.videos && media.videos.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-6">Demo</h2>
            <div className={`grid gap-6 ${media.videos.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
              {media.videos.map((v) => (
                <div key={v.src}>
                  <p className="text-xs font-medium text-stone-500 mb-2">{v.label}</p>
                  <video
                    src={v.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-md bg-stone-100"
                  />
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">{v.caption}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Dataset images (small, at bottom) ── */}
        {item.images && item.images.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Dataset</h2>
            <div className="flex flex-wrap gap-6">
              {item.images.map((img, i) => (
                <div key={i} className="w-40 shrink-0">
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-stone-100">
                    <Image src={img.src} alt={img.alt} fill
                           className="object-contain" unoptimized />
                  </div>
                  {img.caption && (
                    <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Links ── */}
        {item.links.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              {item.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-stone-600 border border-stone-300 rounded-lg px-3 py-1.5
                              hover:border-stone-500 hover:text-stone-900 duration-200">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
