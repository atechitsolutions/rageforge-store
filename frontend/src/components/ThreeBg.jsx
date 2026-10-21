import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "@designcodeio/threeui/style.css";

// Free ThreeUI components, loaded on demand from their own sub-paths so the main bundle stays small.
const Topology = lazy(() => import("@designcodeio/threeui/components/StructureFlowCollection").then((m) => ({ default: m.StructureFlowCollection })));
const Laser = lazy(() => import("@designcodeio/threeui/components/LaserCollection").then((m) => ({ default: m.LaserCollection })));
const Bloom = lazy(() => import("@designcodeio/threeui/components/SemanticBloom").then((m) => ({ default: m.SemanticBloom })));

// Heavy 3D is skipped on phones, low-memory devices, data saver and reduced-motion users.
export function canRun3D() {
  if (typeof window === "undefined") return false;
  const small = window.matchMedia("(max-width: 820px)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection || {};
  const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 2;
  return !(small || reduce || conn.saveData || lowMem);
}

// Mounts the effect only while it is on screen, and unmounts it when scrolled away to free the GPU.
export default function ThreeBg({ kind = "topology", className = "", id, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ok] = useState(canRun3D);

  useEffect(() => {
    if (!ok || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ok]);

  return (
    <div ref={ref} id={id} className={"threebg " + className} aria-hidden="true">
      <div className="threebg-fallback" />
      {ok && visible && (
        <Suspense fallback={null}>
          <div className="shader-frame">
            {kind === "topology" && <Topology variant="topology-field" hue={props.hue ?? 0} saturation={1} brightness={props.brightness ?? 1} />}
            {kind === "laser" && <Laser speed={0.8} size={1} length={1} density={1} opacity={0.9} hue={props.hue ?? 0} saturation={1} brightness={1} />}
            {kind === "bloom" && <Bloom mode="dark" text={props.text || "RageForge"} size={1} opacity={1} />}
          </div>
        </Suspense>
      )}
      {children}
    </div>
  );
}
