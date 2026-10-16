import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import TiltCard from "../components/TiltCard.jsx";
import ProductTub from "../components/ProductTub.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useStore, rupee } from "../store.jsx";

export default function Product() {
  const { slug } = useParams(); const nav = useNavigate();
  const { catalog, addToCart, toggleWish, wish } = useStore();
  const p = catalog.products.find((x) => x.slug === slug);
  const [si, setSi] = useState(0); const [fl, setFl] = useState(0); const [qty, setQty] = useState(1); const [tab, setTab] = useState("about");
  useEffect(() => { setSi(0); setFl(0); setQty(1); setTab("about"); }, [slug]);

  if (catalog.source === "loading") return <div className="wrap page"><p className="muted">Loading…</p></div>;
  if (!p) return <div className="wrap page"><h1 className="h1">Product not found</h1><Link className="btn" to="/shop">Back to shop</Link></div>;

  const s = p.sizes[si]; const saved = wish.includes(p.id);
  const related = catalog.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const add = (open = true) => addToCart(p, s, p.flavours[fl], qty, open);

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to={`/shop?category=${p.category}`}>{p.category.replace(/-/g, " ")}</Link> / <span>{p.name}</span></nav>
      <div className="pdp">
        <TiltCard max={7} className="pdp-media"><ProductTub product={p} size="lg" /></TiltCard>
        <div className="pdp-info">
          {p.badge && <span className="pbadge static">{p.badge}</span>}
          <h1 className="h1">{p.name}</h1>
          <p className="muted">{p.tagline}</p>
          <div className="pprice big"><b>{rupee(s.price)}</b><s>{rupee(s.mrp)}</s><em>{Math.round(((s.mrp - s.price) / s.mrp) * 100)}% off</em></div>
          <p className="fine">Demo pricing · inclusive of taxes (sample)</p>

          <h4>Size</h4>
          <div className="opts">{p.sizes.map((x, i) => <button key={x.label} className={"chip" + (i === si ? " on" : "")} onClick={() => setSi(i)}>{x.label}</button>)}</div>
          <h4>Flavour</h4>
          <div className="opts">{p.flavours.map((x, i) => <button key={x} className={"chip" + (i === fl ? " on" : "")} onClick={() => setFl(i)}>{x}</button>)}</div>

          <div className="buy">
            <div className="qty big"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase">+</button></div>
            <button className="btn" onClick={() => add(true)}>Add to cart</button>
            <button className="btn ghost" onClick={() => { add(false); nav("/checkout"); }}>Buy now</button>
            <button className={"icon-btn outline" + (saved ? " on" : "")} onClick={() => toggleWish(p.id)} aria-pressed={saved} aria-label="Wishlist">♥</button>
          </div>

          <div className="tabs" role="tablist">{[["about", "About"], ["facts", "Key facts"], ["ship", "Delivery & returns"]].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
          <div className="tab-body">
            {tab === "about" && <p>{p.description}</p>}
            {tab === "facts" && (p.facts.length ? <><ul className="facts">{p.facts.map((f) => <li key={f}>{f}</li>)}</ul><p className="fine">Taken from the pack artwork. Verify against the final printed label before launch.</p></> : <p>Detailed composition has not been added for this sample listing. It will come from the final label.</p>)}
            {tab === "ship" && <p>Demo store: orders are saved as demo orders and no payment is collected. Delivery is free above ₹999, otherwise ₹79 (sample rule). Real return terms to be added by the business.</p>}
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="sec"><h2 className="h2">More in this category</h2><div className="grid">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div></section>}
    </div>
  );
}
