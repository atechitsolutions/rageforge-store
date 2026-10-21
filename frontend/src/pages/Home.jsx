import { Link } from "react-router-dom";
import ThreeBg from "../components/ThreeBg.jsx";
import TiltCard from "../components/TiltCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductTub from "../components/ProductTub.jsx";
import { useStore, rupee } from "../store.jsx";

const BENEFITS = [
  ["Builds lean muscle", "M4 14c2-6 6-8 9-6l3 2 4-3v4l-4 3-3-1c-2 2-6 4-9 1z"],
  ["Faster recovery", "M13 2 5 14h6l-1 8 9-13h-6z"],
  ["Improves performance", "M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  ["Supports immunity", "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"],
];

export default function Home() {
  const { catalog } = useStore();
  const hero = catalog.products.find((p) => p.imageKey);
  const best = catalog.products.filter((p) => p.bestseller);
  const featured = catalog.products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="hero">
        <ThreeBg kind="topology" className="hero-bg" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">RAGEFORGE · Performance Nutrition</p>
            <h1 className="display">Fuel your<br /><span>next level</span></h1>
            <p className="lead">Strength. Focus. Recovery. Everyday. Whey, creatine, pre-workout and gear, forged for people who train like it matters.</p>
            <div className="cta-row">
              <Link className="btn" to="/shop">Shop all</Link>
              {hero && <Link className="btn ghost" to={`/product/${hero.slug}`}>Meet the flagship whey</Link>}
            </div>
            <ul className="stat-row"><li><b>7</b><span>categories</span></li><li><b>{catalog.products.length || 16}</b><span>products</span></li><li><b>RAGE10</b><span>demo code</span></li></ul>
          </div>
          <div className="hero-visual">
            {hero && (
              <TiltCard max={9} className="hero-tilt">
                <img src={`/brand/${hero.imageKey}.webp`} alt="RAGEFORGE Premium Whey Protein, Rich Chocolate, 1 kg" fetchpriority="high" />
              </TiltCard>
            )}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 2 }).map((_, k) => (<span key={k}>BUILT FOR A STRONGER YOU ◆ STRENGTH ◆ FOCUS ◆ RECOVERY ◆ EVERYDAY ◆&nbsp;</span>))}</div></div>

      <section className="wrap sec">
        <div className="sec-head"><h2 className="h2">Shop by category</h2><Link to="/shop" className="more">View all →</Link></div>
        <div className="cat-grid">
          {catalog.categories.map((c, i) => {
            const rep = catalog.products.find((p) => p.category === c.slug);
            return (
              <Link key={c.slug} to={`/shop?category=${c.slug}`} className="cat-card">
                <span className="num">0{i + 1}</span>
                <div className="cat-art">{rep && <ProductTub product={rep} size="sm" />}</div>
                <h3>{c.name}</h3><p>{c.tagline}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head"><h2 className="h2">Best sellers</h2><Link to="/shop?best=1" className="more">See all →</Link></div>
        <div className="rail">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="wrap sec promos">
        <ThreeBg kind="laser" className="promo big">
          <div className="promo-in"><p className="eyebrow">Demo offer</p><h3>Take 10% off with <span>RAGE10</span></h3><p>Add anything to cart and enter the code. Free delivery above ₹999.</p><Link to="/shop" className="btn">Shop now</Link></div>
        </ThreeBg>
        <div className="promo small ember">
          <p className="eyebrow">Flagship</p><h3>Premium Whey<br />Rich Chocolate</h3><p>24 g protein per serving*</p>
          {hero && <Link className="btn ghost" to={`/product/${hero.slug}`}>View product</Link>}
        </div>
      </section>

      <section className="wrap sec benefits">
        <h2 className="h2">Why RageForge</h2>
        <div className="ben-grid">
          {BENEFITS.map(([t, d]) => (
            <div key={t} className="ben"><svg viewBox="0 0 24 24" width="34" height="34"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /></svg><h4>{t}</h4></div>
          ))}
        </div>
        <p className="fine">*Taken from pack artwork. Benefit statements are brand copy and must be verified against the final label and applicable regulations before launch.</p>
      </section>

      <section className="wrap sec">
        <div className="partner-cta">
          <div>
            <p className="eyebrow">Grow with RageForge</p>
            <h2 className="h2">Bring performance nutrition to your community.</h2>
            <p>Own a store, run a gym, or serve customers online? Apply to become a RageForge distributor.</p>
          </div>
          <Link className="btn" to="/distributor">Become a distributor</Link>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-head"><h2 className="h2">Editor's picks</h2></div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <ThreeBg id="about" kind="bloom" text="RageForge" className="brand-bloom">
        <div className="bloom-cap"><h2 className="h2">Forged, not given.</h2><Link className="btn" to="/shop">Explore the range</Link></div>
      </ThreeBg>
    </>
  );
}
