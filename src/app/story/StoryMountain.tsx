"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { EVENTS, MIN_AGE, MAX_AGE, type StoryEvent } from "./events";

// ──────────────────────────────────────────────────────────────────────────────
// Layout: true altitude profile (Y=altitude, X=age) with minimap + pan.
// Main viewBox shows only VIEW_W of the FULL_W timeline; minimap at the bottom
// renders the entire timeline plus a centered viewport window you can scrub.
// The event closest to the main view's horizontal center gets highlighted.
//
// EDGE_PAD adds virtual space before the first event and after the last, so
// when the user pans to either end the ridge keeps descending out to the
// scroll arrow edge instead of cutting off at the first/last node.
// ──────────────────────────────────────────────────────────────────────────────

const EVENT_SPAN = 2400;                // x-range occupied by actual events
const EDGE_PAD = 220;                   // virtual space on each side
const FULL_W = EVENT_SPAN + EDGE_PAD * 2;
const VIEW_W = 900;                     // visible window width
const VIEW_H = 640;                     // main view height
const MAIN_PAD_Y = 48;                  // top/bottom breathing room inside main view
const MAX_PAN = FULL_W - VIEW_W;

// Where the ridge meets the virtual edges. Low altitude so the range
// visually "trails off" into the horizon rather than ending abruptly.
const EDGE_LEAD_ALT = 8;
const EDGE_TRAIL_ALT = 8;

// Mountain body texture — instead of dense hatching, we draw a few
// "receding ridge" echoes: copies of the main ridge path shifted downward
// by growing amounts with decreasing opacity. Reads as layered ridgelines
// fading into the depth of the mountain, the classical 远山 motif in
// Chinese ink landscape painting.
const CONTOUR_ECHOES = [
  { dy: 52,  opacity: 0.26, sw: 1.5 },
  { dy: 108, opacity: 0.17, sw: 1.3 },
  { dy: 168, opacity: 0.10, sw: 1.1 },
];

const MINIMAP_H = 88;                   // minimap frame height
// Asymmetric padding: data range is 6–96 (not 0–100), so a symmetric pad
// leaves the peaks hugging the top edge more tightly than valleys hug bottom.
// A slightly larger top pad visually centers the curve.
const MINIMAP_PAD_TOP = 7;
const MINIMAP_PAD_BOTTOM = 5;
const MINIMAP_WINDOW_H = 56;            // shorter than frame so it sits centered
const MINIMAP_WINDOW_Y = (MINIMAP_H - MINIMAP_WINDOW_H) / 2;

function xFor(age: number): number {
  return EDGE_PAD + ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * EVENT_SPAN;
}
function yFor(altitude: number, height: number, padTop: number, padBottom: number = padTop): number {
  return (1 - altitude / 100) * (height - padTop - padBottom) + padTop;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX.toFixed(2)} ${p0.y.toFixed(2)}, ${midX.toFixed(2)} ${p1.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

const clampPan = (v: number) => Math.max(0, Math.min(MAX_PAN, v));

export function StoryMountain() {
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);

  // rAF tween for button / keyboard pans; cancels if interrupted.
  const tweenPanTo = (target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = panX;
    const end = clampPan(target);
    if (Math.abs(end - start) < 0.5) return;
    const startTime = performance.now();
    const duration = 380;
    const ease = (t: number) => 1 - (1 - t) * (1 - t); // easeOutQuad
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      setPanX(start + (end - start) * ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(step);
  };
  const cancelTween = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const onMainDown = (e: React.MouseEvent) => {
    e.preventDefault();
    cancelTween();
    setIsDragging(true);
    const startClientX = e.clientX;
    const startPan = panX;
    const w = viewRef.current?.clientWidth || 1;
    const unitsPerPx = VIEW_W / w;
    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startClientX;
      setPanX(clampPan(startPan - dx * unitsPerPx));
    };
    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const onMiniDown = (e: React.MouseEvent) => {
    e.preventDefault();
    cancelTween();
    if (!miniRef.current) return;
    setIsDragging(true);
    const rect = miniRef.current.getBoundingClientRect();
    const toSvgX = (clientX: number) => ((clientX - rect.left) / rect.width) * FULL_W;
    setPanX(clampPan(toSvgX(e.clientX) - VIEW_W / 2));
    const handleMove = (ev: MouseEvent) => {
      setPanX(clampPan(toSvgX(ev.clientX) - VIEW_W / 2));
    };
    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  tweenPanTo(panX - VIEW_W * 0.4);
      if (e.key === "ArrowRight") tweenPanTo(panX + VIEW_W * 0.4);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panX]);

  useEffect(() => () => cancelTween(), []);

  // Ridge points include two virtual endpoints (at x=0 and x=FULL_W) so
  // the ridge descends gracefully to the scroll-arrow edges instead of
  // cutting off at the first/last event.
  const ridgePoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    pts.push({ x: 0, y: yFor(EDGE_LEAD_ALT, VIEW_H, MAIN_PAD_Y) });
    EVENTS.forEach(e =>
      pts.push({ x: xFor(e.age), y: yFor(e.altitude, VIEW_H, MAIN_PAD_Y) })
    );
    pts.push({ x: FULL_W, y: yFor(EDGE_TRAIL_ALT, VIEW_H, MAIN_PAD_Y) });
    return pts;
  }, []);
  const mainPath = useMemo(() => smoothPath(ridgePoints), [ridgePoints]);
  // Closed polygon: ridge on top + bottom edge → "mountain mass" silhouette,
  // used both for the gradient fill and as the clip for contour echoes.
  const massPath = useMemo(
    () => `${mainPath} L ${FULL_W} ${VIEW_H} L 0 ${VIEW_H} Z`,
    [mainPath]
  );
  // Receding ridge echoes — same curve shifted downward with falling
  // opacity. Clipped to the mass silhouette so lower echoes fade against
  // the baseline rather than cutting out into empty space.
  const contourPaths = useMemo(() => {
    return CONTOUR_ECHOES.map(e => ({
      ...e,
      d: smoothPath(ridgePoints.map(p => ({ x: p.x, y: p.y + e.dy }))),
    }));
  }, [ridgePoints]);
  // Minimap ridge — same virtual-edge extension, at the minimap's scale.
  const miniPath = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    pts.push({
      x: 0,
      y: yFor(EDGE_LEAD_ALT, MINIMAP_H, MINIMAP_PAD_TOP, MINIMAP_PAD_BOTTOM),
    });
    EVENTS.forEach(e =>
      pts.push({
        x: xFor(e.age),
        y: yFor(e.altitude, MINIMAP_H, MINIMAP_PAD_TOP, MINIMAP_PAD_BOTTOM),
      })
    );
    pts.push({
      x: FULL_W,
      y: yFor(EDGE_TRAIL_ALT, MINIMAP_H, MINIMAP_PAD_TOP, MINIMAP_PAD_BOTTOM),
    });
    return smoothPath(pts);
  }, []);

  // Which event is closest to the horizontal center of the current window?
  const centerX = panX + VIEW_W / 2;
  const focusedIdx = useMemo(() => {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < EVENTS.length; i++) {
      const d = Math.abs(xFor(EVENTS[i].age) - centerX);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }, [centerX]);

  // Readout shows the age range currently visible, clamped to the real
  // event span so the virtual edge padding doesn't produce negative ages.
  const ageAtLeft = Math.max(
    MIN_AGE,
    Math.min(MAX_AGE, MIN_AGE + ((panX - EDGE_PAD) / EVENT_SPAN) * (MAX_AGE - MIN_AGE))
  );
  const ageAtRight = Math.max(
    MIN_AGE,
    Math.min(MAX_AGE, MIN_AGE + ((panX + VIEW_W - EDGE_PAD) / EVENT_SPAN) * (MAX_AGE - MIN_AGE))
  );

  const ageTicks: number[] = [];
  for (let a = Math.ceil(MIN_AGE); a <= Math.floor(MAX_AGE); a += 2) ageTicks.push(a);

  return (
    <div className="container mx-auto px-4 sm:px-8 pt-16 pb-10 max-w-5xl">
      {/* Title — sits just beneath the fixed nav, deliberately small so it
          doesn't outweigh the nav controls. */}
      <header className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-display text-stone-800 mb-1">
          The Climb So Far
        </h1>
        <p className="text-[12px] sm:text-[13px] text-stone-500 max-w-md mx-auto leading-relaxed">
          Life as altitude over time — drag the ridge or scrub the overview to travel.
          Tap the filled nodes for the longer story.
        </p>
      </header>

      {/* Main view with side arrows */}
      <div className="flex items-stretch gap-3">
        <button
          onClick={() => tweenPanTo(panX - VIEW_W * 0.5)}
          aria-label="Pan left"
          disabled={panX <= 0.5}
          className="shrink-0 w-10 rounded-lg text-stone-700 bg-stone-900/[0.05] hover:text-stone-900 hover:bg-stone-900/[0.1] disabled:text-stone-400 disabled:bg-stone-900/[0.02] disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>

        <div
          ref={viewRef}
          onMouseDown={onMainDown}
          className={`relative flex-1 overflow-hidden select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <svg
            viewBox={`${panX} 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block w-full h-auto"
          >
            <defs>
              <filter id="roughMain" x="-2%" y="-2%" width="104%" height="104%">
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="turb" />
                <feDisplacementMap in="SourceGraphic" in2="turb" scale="4" />
              </filter>
              {/* Vertical earthy gradient — transparent at top, warm mid,
                  deeper at the base. Carries the light→dark weighting from
                  ridge to foot. */}
              <linearGradient id="mountainMass" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={VIEW_H}>
                <stop offset="0" stopColor="#a8946d" stopOpacity="0" />
                <stop offset="0.55" stopColor="#a8946d" stopOpacity="0.18" />
                <stop offset="1" stopColor="#6e5f3f" stopOpacity="0.34" />
              </linearGradient>
              <clipPath id="mountainClip">
                <path d={massPath} />
              </clipPath>
            </defs>

            {/* Mass fill — earthy gradient sits behind the ridge and echoes. */}
            <path d={massPath} fill="url(#mountainMass)" />
            {/* Receding ridge echoes — layered contours fading into depth,
                clipped to the mass and rough-filtered for a hand-drawn feel. */}
            <g clipPath="url(#mountainClip)" filter="url(#roughMain)">
              {contourPaths.map((c, i) => (
                <path key={i}
                  d={c.d}
                  stroke="#3f3a35" strokeOpacity={c.opacity}
                  strokeWidth={c.sw}
                  fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>

            {/* altitude guide lines */}
            {[20, 50, 80].map(alt => {
              const y = yFor(alt, VIEW_H, MAIN_PAD_Y);
              return (
                <line key={alt}
                  x1={0} x2={FULL_W} y1={y} y2={y}
                  stroke="#d6cfc3" strokeDasharray="4 6" strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* age ticks along bottom */}
            {ageTicks.map(a => {
              const x = xFor(a);
              return (
                <g key={`tick-${a}`}>
                  <line
                    x1={x} x2={x} y1={VIEW_H - 24} y2={VIEW_H - 16}
                    stroke="#a8a096" strokeWidth={1} vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={x} y={VIEW_H - 4}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#9a928a"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  >
                    {a}
                  </text>
                </g>
              );
            })}

            {/* ridge path */}
            <path
              d={mainPath}
              stroke="#3f3a35" strokeWidth={2.8}
              strokeLinecap="round" strokeLinejoin="round"
              fill="none"
              filter="url(#roughMain)"
            />

            {/* nodes — focused event gets a halo and bigger radius */}
            {EVENTS.map((e, i) => {
              const x = xFor(e.age), y = yFor(e.altitude, VIEW_H, MAIN_PAD_Y);
              const isFocused = i === focusedIdx;
              const baseR = e.deep ? 10 : 6;
              const r = isFocused ? baseR + 3 : baseR;
              return (
                <g key={i} filter="url(#roughMain)">
                  {isFocused && (
                    <circle cx={x} cy={y} r={r + 8}
                      fill="none" stroke="#3f3a35" strokeOpacity={0.25} strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <circle cx={x} cy={y} r={r}
                    fill="#fdfaf3" stroke="#3f3a35"
                    strokeWidth={isFocused ? 3 : (e.deep ? 2.4 : 1.8)}
                  />
                  {e.deep && <circle cx={x} cy={y} r={3.5} fill="#3f3a35" />}
                </g>
              );
            })}
          </svg>

          {/* Bubbles — HTML overlay in viewport-percent. Cull off-window. */}
          {EVENTS.map((e, i) => {
            const x = xFor(e.age);
            if (x < panX - 40 || x > panX + VIEW_W + 40) return null;
            const leftPct = ((x - panX) / VIEW_W) * 100;
            const topPct = (yFor(e.altitude, VIEW_H, MAIN_PAD_Y) / VIEW_H) * 100;
            const placeAbove = e.altitude < 50;
            const VERT = 20;
            return (
              <div
                key={i}
                className="absolute pointer-events-auto"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: placeAbove
                    ? `translate(-50%, calc(-100% - ${VERT}px))`
                    : `translate(-50%, ${VERT}px)`,
                  zIndex: i === focusedIdx ? 20 : 10,
                }}
                onMouseDown={(ev) => ev.stopPropagation()}
              >
                <Bubble
                  event={e}
                  altSign={i % 2 === 0 ? 1 : -1}
                  focused={i === focusedIdx}
                />
              </div>
            );
          })}

          {/* age readout */}
          <div className="absolute top-3 right-4 text-[10px] uppercase tracking-widest text-stone-500 font-mono pointer-events-none">
            age {ageAtLeft.toFixed(1)} → {ageAtRight.toFixed(1)}
          </div>
        </div>

        <button
          onClick={() => tweenPanTo(panX + VIEW_W * 0.5)}
          aria-label="Pan right"
          disabled={panX >= MAX_PAN - 0.5}
          className="shrink-0 w-10 rounded-lg text-stone-700 bg-stone-900/[0.05] hover:text-stone-900 hover:bg-stone-900/[0.1] disabled:text-stone-400 disabled:bg-stone-900/[0.02] disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Minimap — pushed to the bottom */}
      <div className="px-12 mt-10">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">
            full life overview
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            drag or click to jump
          </span>
        </div>
        <div className="relative rounded-lg bg-white/55 overflow-hidden">
          <svg
            ref={miniRef}
            viewBox={`0 0 ${FULL_W} ${MINIMAP_H}`}
            preserveAspectRatio="none"
            onMouseDown={onMiniDown}
            className="block w-full cursor-pointer select-none"
            style={{ height: `${MINIMAP_H}px` }}
          >
            <path
              d={miniPath}
              stroke="#3f3a35" strokeWidth={2.4}
              strokeLinecap="round" strokeLinejoin="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {EVENTS.map((e, i) => (
              <circle
                key={i}
                cx={xFor(e.age)}
                cy={yFor(e.altitude, MINIMAP_H, MINIMAP_PAD_TOP, MINIMAP_PAD_BOTTOM)}
                r={e.deep ? 5 : 2.5}
                fill={e.deep ? "#3f3a35" : "#fdfaf3"}
                stroke="#3f3a35"
                strokeWidth={1.6}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* centered viewport window */}
            <rect
              x={panX}
              y={MINIMAP_WINDOW_Y}
              width={VIEW_W}
              height={MINIMAP_WINDOW_H}
              rx={4}
              fill="#3f3a35"
              fillOpacity={0.08}
              stroke="#3f3a35"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        {/* age labels outside the border so the bordered frame equals the SVG;
            this keeps the viewport window visually centered */}
        <div className="flex justify-between px-1 pt-1.5 text-[9px] text-stone-500 font-mono">
          <span>age {MIN_AGE}</span>
          <span>age {MAX_AGE}</span>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  event,
  altSign,
  focused,
}: {
  event: StoryEvent;
  altSign: 1 | -1;
  focused: boolean;
}) {
  const isDeep = !!event.deep;
  const rotateClass = altSign > 0 ? "-rotate-1" : "rotate-1";

  const base =
    "relative bg-[#fdfaf3] border-stone-700 rounded-[14px] px-3 py-2 duration-200";
  const borderW = focused ? "border-2" : "border-[1.5px]";
  const shadow = focused
    ? "shadow-[4px_4px_0_rgba(63,58,53,0.28)] -translate-y-0.5"
    : "shadow-[2px_2px_0_rgba(63,58,53,0.12)] hover:shadow-[3px_3px_0_rgba(63,58,53,0.22)] hover:-translate-y-0.5";

  const content = (
    <div
      className={`${base} ${borderW} ${shadow} ${rotateClass}`}
      style={{ width: "max-content", maxWidth: "180px" }}
    >
      <p className="text-[12px] sm:text-[13px] leading-snug text-stone-800 italic">
        {event.label}
      </p>
      {isDeep && (
        <div className="flex items-center gap-1 mt-1.5 text-stone-700">
          <span className="text-[10px] uppercase tracking-wider italic">read more</span>
          <ArrowUpRight size={11} />
        </div>
      )}
    </div>
  );

  if (isDeep && event.slug) {
    return (
      <Link href={`/story/${event.slug}`} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
