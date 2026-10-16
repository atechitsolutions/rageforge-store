import { useRef } from "react";

// Pointer-reactive 3D tilt using CSS transforms only (cheap on mobile; disabled for touch/reduced motion).
export default function TiltCard({ children, max = 10, className = "" }) {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", (-y * max).toFixed(2) + "deg");
    el.style.setProperty("--ry", (x * max).toFixed(2) + "deg");
    el.style.setProperty("--gx", (x * 100 + 50).toFixed(0) + "%");
    el.style.setProperty("--gy", (y * 100 + 50).toFixed(0) + "%");
  };
  const reset = () => { const el = ref.current; ["--rx", "--ry"].forEach((k) => el.style.setProperty(k, "0deg")); };
  return (
    <div className={"tilt " + className} ref={ref} onPointerMove={move} onPointerLeave={reset}>
      <div className="tilt-inner">{children}<span className="tilt-glare" /></div>
    </div>
  );
}
