"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EVENTS, MIN_AGE, MAX_AGE, type StoryEvent } from "./events";

// ──────────────────────────────────────────────────────────────────────────────
// Mobile portrait layout: axes swapped from desktop.
//   Y = time (top = younger, bottom = older; flows with natural scroll)
//   X = altitude (centerline → peaks bulge right, valleys dip left)
// A horizontal minimap sticks to the bottom of the viewport and shows the
// whole life the "traditional" way (X=age, Y=altitude) with a scroll-synced
// highlight band you can tap to jump.
// ──────────────────────────────────────────────────────────────────────────────

const VB_W = 400;                 // SVG coordinate width
const VB_H = 2600;                // SVG coordinate height — tall
const PAD_X = 30;                 // left/right breathing room
const PAD_Y_TOP = 48;
const PAD_Y_BOTTOM = 48;

const MINI_W = 1200;
const MINI_H = 70;
const MINI_PAD_TOP = 7;
const MINI_PAD_BOTTOM = 5;

function xForAltitude(alt: number) {
  const half = VB_W / 2 - PAD_X;
  return VB_W / 2 + ((alt - 50) / 50) * half;
}
function yForAge(age: number) {
  return PAD_Y_TOP + ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * (VB_H - PAD_Y_TOP - PAD_Y_BOTTOM);
}

function xMini(age: number) {
  return ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * MINI_W;
}
function yMini(altitude: number) {
  return (1 - altitude / 100) * (MINI_H - MINI_PAD_TOP - MINI_PAD_BOTTOM) + MINI_PAD_TOP;
}

// Vertical smooth path: control points shift Y (not X as on desktop).
function verticalSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x.toFixed(2)} ${midY.toFixed(2)}, ${p1.x.toFixed(2)} ${midY.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

function horizontalSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX.toFixed(2)} ${p0.y.toFixed(2)}, ${midX.toFixed(2)} ${p1.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

export function StoryMountainMobile() {
  const mountainRef = useRef<HTMLDivElement>(null);
  const miniSvgRef = useRef<SVGSVGElement>(null);

  // Visible-age window derived from scroll position. Drives the minimap
  // highlight band and the "focused" node on the main view.
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({
    start: MIN_AGE,
    end: MIN_AGE + 4,
  });

  useEffect(() => {
    const update = () => {
      const el = mountainRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mountainH = rect.height;
      if (mountainH <= 0) return;   // hidden on desktop
      const vpH = window.innerHeight || 1;
      // Where the viewport top & bottom sit inside the mountain (px).
      const topInside = Math.max(0, -rect.top);
      const bottomInside = Math.min(mountainH, topInside + vpH);
      const fracStart = topInside / mountainH;
      const fracEnd = bottomInside / mountainH;
      const span = MAX_AGE - MIN_AGE;
      setVisibleRange({
        start: MIN_AGE + fracStart * span,
        end: MIN_AGE + fracEnd * span,
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const mainPath = useMemo(
    () => verticalSmoothPath(EVENTS.map((e) => ({ x: xForAltitude(e.altitude), y: yForAge(e.age) }))),
    []
  );
  const miniPath = useMemo(
    () => horizontalSmoothPath(EVENTS.map((e) => ({ x: xMini(e.age), y: yMini(e.altitude) }))),
    []
  );

  // Centered event = whatever's closest to the vertical center of viewport.
  const centerAge = (visibleRange.start + visibleRange.end) / 2;
  const focusedIdx = useMemo(() => {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < EVENTS.length; i++) {
      const d = Math.abs(EVENTS[i].age - centerAge);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }, [centerAge]);

  // Tap on minimap: compute target age, find pixel Y in the mountain,
  // scroll the window so that age sits at the viewport center.
  const jumpToAge = (age: number) => {
    const el = mountainRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mountainTopAbsolute = rect.top + window.scrollY;
    const mountainH = rect.height;
    const frac = (age - MIN_AGE) / (MAX_AGE - MIN_AGE);
    const targetYInMountain = frac * mountainH;
    const vpH = window.innerHeight || 1;
    const targetScroll = mountainTopAbsolute + targetYInMountain - vpH / 2;
    window.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
  };

  const onMiniDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!miniSvgRef.current) return;
    const rect = miniSvgRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const frac = (clientX - rect.left) / rect.width;
    const age = MIN_AGE + Math.max(0, Math.min(1, frac)) * (MAX_AGE - MIN_AGE);
    jumpToAge(age);
  };

  const highlightX = xMini(visibleRange.start);
  const highlightW = Math.max(10, xMini(visibleRange.end) - xMini(visibleRange.start));

  return (
    <div className="relative">
      <header className="px-4 pt-16 pb-5 text-center">
        <h1 className="text-xl font-display text-stone-800 mb-1">The Climb So Far</h1>
        <p className="text-[12px] text-stone-500 leading-relaxed px-4">
          Scroll down — life flows top to bottom, peaks lean right, valleys dip left.
        </p>
      </header>

      {/* Main vertical mountain */}
      <div
        ref={mountainRef}
        className="relative w-full"
        style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <filter id="roughMobile" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="turb" />
              <feDisplacementMap in="SourceGraphic" in2="turb" scale="3.5" />
            </filter>
          </defs>

          {/* Centerline = altitude 50 */}
          <line
            x1={VB_W / 2} x2={VB_W / 2}
            y1={PAD_Y_TOP} y2={VB_H - PAD_Y_BOTTOM}
            stroke="#d6cfc3" strokeDasharray="4 6" strokeWidth={1}
          />

          {/* Age ticks down the left edge */}
          {Array.from({ length: Math.floor(MAX_AGE - MIN_AGE) + 1 }, (_, i) => MIN_AGE + i)
            .filter((a) => a % 2 === 0)
            .map((a) => {
              const y = yForAge(a);
              return (
                <g key={`t-${a}`}>
                  <line x1={8} x2={16} y1={y} y2={y} stroke="#a8a096" strokeWidth={1} />
                  <text
                    x={20} y={y + 4}
                    fontSize="12"
                    fill="#9a928a"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  >
                    {a}
                  </text>
                </g>
              );
            })}

          {/* Ridge path */}
          <path
            d={mainPath}
            stroke="#3f3a35" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            fill="none"
            filter="url(#roughMobile)"
          />

          {/* Nodes */}
          {EVENTS.map((e, i) => {
            const x = xForAltitude(e.altitude);
            const y = yForAge(e.age);
            const isFocused = i === focusedIdx;
            const baseR = e.deep ? 9 : 5.5;
            const r = isFocused ? baseR + 2.5 : baseR;
            return (
              <g key={i} filter="url(#roughMobile)">
                {isFocused && (
                  <circle cx={x} cy={y} r={r + 7}
                    fill="none" stroke="#3f3a35" strokeOpacity={0.25} strokeWidth={1.4}
                  />
                )}
                <circle cx={x} cy={y} r={r}
                  fill="#fdfaf3" stroke="#3f3a35"
                  strokeWidth={isFocused ? 2.8 : (e.deep ? 2.2 : 1.7)}
                />
                {e.deep && <circle cx={x} cy={y} r={3} fill="#3f3a35" />}
              </g>
            );
          })}
        </svg>

        {/* Bubbles overlaid in HTML — peaks put bubble on LEFT, valleys on RIGHT */}
        {EVENTS.map((e, i) => {
          const x = xForAltitude(e.altitude);
          const y = yForAge(e.age);
          const leftPct = (x / VB_W) * 100;
          const topPct = (y / VB_H) * 100;
          const placeLeft = e.altitude > 50;
          const HORIZ = 14;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: placeLeft
                  ? `translate(calc(-100% - ${HORIZ}px), -50%)`
                  : `translate(${HORIZ}px, -50%)`,
                zIndex: i === focusedIdx ? 20 : 10,
              }}
            >
              <Bubble event={e} focused={i === focusedIdx} />
            </div>
          );
        })}
      </div>

      {/* Sticky bottom minimap — stays pinned while inside this wrapper */}
      <div className="sticky bottom-0 left-0 right-0 z-40 pb-3 pt-2 bg-stone-50/85 backdrop-blur-sm">
        <div className="px-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[9px] uppercase tracking-widest text-stone-500 font-mono">
              full life overview
            </span>
            <span className="text-[9px] text-stone-400 font-mono">
              age {centerAge.toFixed(1)}
            </span>
          </div>
          <div className="relative rounded-lg bg-white/55 overflow-hidden">
            <svg
              ref={miniSvgRef}
              viewBox={`0 0 ${MINI_W} ${MINI_H}`}
              preserveAspectRatio="none"
              onMouseDown={onMiniDown}
              onTouchStart={onMiniDown}
              className="block w-full cursor-pointer select-none"
              style={{ height: `${MINI_H}px` }}
            >
              <path
                d={miniPath}
                stroke="#3f3a35" strokeWidth={2.2}
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              {EVENTS.map((e, i) => (
                <circle
                  key={i}
                  cx={xMini(e.age)} cy={yMini(e.altitude)}
                  r={e.deep ? 4.5 : 2.2}
                  fill={e.deep ? "#3f3a35" : "#fdfaf3"}
                  stroke="#3f3a35" strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* Highlight band = currently visible age range */}
              <rect
                x={highlightX}
                y={0}
                width={highlightW}
                height={MINI_H}
                fill="#3f3a35"
                fillOpacity={0.1}
                stroke="#3f3a35"
                strokeWidth={1.8}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex justify-between px-1 pt-1 text-[9px] text-stone-500 font-mono">
            <span>age {MIN_AGE}</span>
            <span>age {MAX_AGE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ event, focused }: { event: StoryEvent; focused: boolean }) {
  const isDeep = !!event.deep;
  const borderW = focused ? "border-2" : "border-[1.5px]";
  const shadow = focused
    ? "shadow-[3px_3px_0_rgba(63,58,53,0.28)]"
    : "shadow-[2px_2px_0_rgba(63,58,53,0.12)]";

  const content = (
    <div
      className={`relative bg-[#fdfaf3] border-stone-700 rounded-[12px] px-2.5 py-1.5 ${borderW} ${shadow}`}
      style={{ width: "max-content", maxWidth: "140px" }}
    >
      <p className="text-[11px] leading-snug text-stone-800 italic">{event.label}</p>
      {isDeep && (
        <div className="flex items-center gap-0.5 mt-1 text-stone-700">
          <span className="text-[9px] uppercase tracking-wider italic">read more</span>
          <ArrowUpRight size={10} />
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
