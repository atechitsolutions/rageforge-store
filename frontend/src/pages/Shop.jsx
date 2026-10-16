import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore, rupee } from "../store.jsx";

const SORTS = { featured: "Featured", low: "Price: low to high", high: "Price: high to low", name: "Name A–Z" };

export default function Shop() {
  const { catalog } = useStore();
  const [sp, setSp] = useSearchParams();
  const [panel, setPanel] = useState(false);
  const q = sp.get("q") || ""; const cat = sp.get("category") || ""; const sort = sp.get("sort") || "featured";
  const best = sp.get("best") === "1"; const max = Number(sp.get("max")) || 6500; const flav = sp.get("flavour") || "";

  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); };
  const flavours = useMemo(() => [...new Set(catalog.products.flatMap((p) => p.flavours))].sort(), [catalog.products]);

  const list = useMemo(() => {
    const t = q.toLowerCase();
    let r = catalog.products.filter((p) =>
      (!cat || p.category === cat) && (!best || p.bestseller) && p.sizes[0].price <= max &&
      (!flav || p.flavours.includes(flav)) &&
      (!t || [p.name, p.tagline, p.category, ...p.flavours].join(" ").toLowerCase().includes(t)));
    const price = (p) => p.sizes[0].price;
    if (sort === "low") r = [...r].sort((a, b) => price(a) - price(b));
    if (sort === "high") r = [...r].sort((a, b) => price(b) - price(a));
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") r = [...r].sort((a, b) => Number(b.featured) - Number(a.featured));
    return r;
  }, [catalog.products, q, cat, best, max, flav, sort]);

  const title = cat ? catalog.categories.find((c) => c.slug === cat)?.name : q ? `Results for “${q}”` : "All products";

  const Filters = (
    <div className="filters">
      <h4>Category</h4>
      <button className={"chip" + (!cat ? " on" : "")} onClick={() => set("category", "")}>All</button>
      {catalog.categories.map((c) => <button key={c.slug} className={"chip" + (cat === c.slug ? " on" : "")} onClick={() => set("category", c.slug)}>{c.name}</button>)}
      <h4>Max price: {rupee(max)}</h4>
      <input type="range" min="300" max="6500" step="100" value={max} onChange={(e) => set("max", e.target.value === "6500" ? "" : e.target.value)} aria-label="Maximum price" />
      <h4>Flavour</h4>
      <select value={flav} onChange={(e) => set("flavour", e.target.value)} aria-label="Flavour"><option value="">Any</option>{flavours.map((f) => <option key={f}>{f}</option>)}</select>
      <label className="check"><input type="checkbox" checked={best} onChange={(e) => set("best", e.target.checked ? "1" : "")} /> Best sellers only</label>
      <button className="btn ghost sm" onClick={() => setSp({}, { replace: true })}>Clear all</button>
    </div>
  );

  return (
    <div className="wrap page">
      <div className="shop-head">
        <div><p className="eyebrow">Shop</p><h1 className="h1">{title}</h1><p className="muted">{list.length} product{list.length === 1 ? "" : "s"}</p></div>
        <div className="shop-tools">
          <button className="btn ghost sm filter-btn" onClick={() => setPanel(true)}>Filters</button>
          <select value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
      </div>
      <div className="shop-layout">
        <aside className="side">{Filters}</aside>
        {panel && <><div className="scrim show" onClick={() => setPanel(false)} /><div className="sheet">{Filters}<button className="btn block" onClick={() => setPanel(false)}>Show {list.length} results</button></div></>}
        <section>
          {catalog.source === "loading" ? <p className="muted">Loading…</p> : list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <div className="empty"><p>No products match those filters.</p><button className="btn" onClick={() => setSp({}, { replace: true })}>Reset filters</button></div>}
        </section>
      </div>
    </div>
  );
}
