import Image from "next/image";
import { notFound } from "next/navigation";
import { Navigation } from "../../components/nav";
import { ImageLightbox } from "../../components/ImageLightbox";
import { items } from "../data";

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const LOCAL_MEDIA: Record<
  string,
  {
    mediaLayout?: "side-by-side";
    localImages?: { src: string; alt: string; label: string; caption: string; transform?: string }[];
    videos?: { src: string; label: string; caption: string; scaleX?: number; maskFadeX?: number }[];
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
    mediaLayout: "side-by-side",
    localImages: [
      {
        src: "/media/dsec/colmap.png",
        alt: "3D reconstruction via COLMAP",
        label: "3D Reconstruction",
        caption:
          "3D point cloud via COLMAP — used as ground truth for supervising the keypoint matching network.",
        transform: "scale(0.8, 1.2)",
      },
      {
        src: "/media/dsec/compare.png",
        alt: "Feature matching comparison",
        label: "Comparison",
        caption:
          "Single mono frame feature matching — model output vs. baseline under challenging lighting.",
        transform: "scaleX(0.8)",
      },
      {
        src: "/media/dsec/result.png",
        alt: "Feature matching result",
        label: "Result",
        caption:
          "Qualitative matching result on DSEC event frames — keypoint correspondences overlaid on image pairs.",
        transform: "scaleX(0.8)",
      },
    ],
    videos: [
      {
        src: "/media/dsec/test_background.mp4",
        label: "Background Sequence",
        caption:
          "Feature matching on a background-dominated sequence — robustness under low-motion conditions.",
        scaleX: 1.18,
        maskFadeX: 15,
      },
      {
        src: "/media/dsec/test.mp4",
        label: "Motion Sequence",
        caption:
          "Feature matching on a dynamic sequence — performance under motion blur and rapid scene change.",
        maskFadeX: 15,
      },
    ],
  },
};

const maskStyleImage: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

// fadeY=12 matches current top/bottom fade that the user confirmed looks good
function videoMask(fadeX: number, fadeY = 12): React.CSSProperties {
  const h = `linear-gradient(to right, transparent 0%, black ${fadeX}%, black ${100 - fadeX}%, transparent 100%)`;
  const v = `linear-gradient(to bottom, transparent 0%, black ${fadeY}%, black ${100 - fadeY}%, transparent 100%)`;
  return {
    WebkitMaskImage: `${h}, ${v}`,
    maskImage: `${h}, ${v}`,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
}
// Used by the default (non-side-by-side) layout
const maskStyleVideo = videoMask(12);

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();

  const media = LOCAL_MEDIA[slug] ?? {};

  return (
    <div>
      <Navigation backHref="/tldr" />
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

        {/* ── Side-by-side layout (images left | videos+dataset+links right) ── */}
        {media.mediaLayout === "side-by-side" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">

            {/* Left: images */}
            {media.localImages && media.localImages.length > 0 && (
              <div className="flex flex-col gap-6 -translate-x-4">
                {media.localImages.map((img) => (
                  <div key={img.src}>
                    <div className="w-full h-40 overflow-hidden">
                      <ImageLightbox
                        src={img.src}
                        alt={img.alt}
                        thumbnailClassName="w-full h-full object-contain"
                        thumbnailStyle={{
                          ...maskStyleImage,
                          ...(img.transform ? { transform: img.transform } : {}),
                        }}
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">{img.caption}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Right: videos → dataset images → links */}
            <div className="flex flex-col gap-6">
              {media.videos && media.videos.length > 0 && (
                <>
                  {media.videos.map((v) => (
                    <div key={v.src}>
                      <div
                        className="w-full aspect-video overflow-hidden rounded-sm"
                        style={videoMask(v.maskFadeX ?? 15, 8)}
                      >
                        <video
                          src={v.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover bg-stone-100"
                          style={v.scaleX ? { transform: `scaleX(${v.scaleX})` } : undefined}
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-2 leading-relaxed">{v.caption}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Dataset images (small, bottom-right) */}
              {item.images && item.images.length > 0 && (
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.images.map((img, i) => (
                      <div key={i}>
                        <div className="relative w-full aspect-video rounded overflow-hidden bg-stone-100">
                          <Image src={img.src} alt={img.alt} fill
                                 className="object-contain" unoptimized />
                        </div>
                        {img.caption && (
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">{img.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links (bottom-right, below dataset) */}
              {item.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-stone-600 border border-stone-300 rounded-lg px-3 py-1.5
                                  hover:border-stone-500 hover:text-stone-900 duration-200">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

        ) : (
          <>
            {/* ── Default layout: local images → videos → dataset → links ── */}

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
          </>
        )}

      </div>
    </div>
  );
}
