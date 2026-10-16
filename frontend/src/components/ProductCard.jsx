import { Link } from "react-router-dom";
import { useStore, rupee } from "../store.jsx";
import ProductTub from "./ProductTub.jsx";
import TiltCard from "./TiltCard.jsx";

export default function ProductCard({ p }) {
  const { addToCart, toggleWish, wish } = useStore();
  const s = p.sizes[0]; const saved = wish.includes(p.id);
  const off = Math.round(((s.mrp - s.price) / s.mrp) * 100);
  return (
    <article className="pcard">
      {p.badge && <span className="pbadge">{p.badge}</span>}
      <button className={"heart" + (saved ? " on" : "")} onClick={() => toggleWish(p.id)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}>
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" /></svg>
      </button>
      <Link to={`/product/${p.slug}`} className="pmedia">
        <TiltCard max={7} className="product-tilt"><ProductTub product={p} /></TiltCard>
      </Link>
      <div className="pinfo">
        <small className="pcat">{p.category.replace(/-/g, " ")}</small>
        <Link to={`/product/${p.slug}`}><h3>{p.name}</h3></Link>
        <p>{p.tagline}</p>
        <div className="pprice"><b>{rupee(s.price)}</b><s>{rupee(s.mrp)}</s><em>{off}% off</em></div>
        <button className="btn sm" onClick={() => addToCart(p, s, p.flavours[0])}>Add to cart</button>
      </div>
    </article>
  );
}
