import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Footer() {
  const { catalog } = useStore();
  return (
    <footer className="ftr" id="contact">
      <div className="wrap ftr-grid">
        <div className="ftr-brand">
          <img className="ftr-mark" src="rageforgelogo.jpeg" alt="RAGEFORGE Performance Nutrition" loading="lazy" />
          <p>Performance nutrition engineered for athletes who train with purpose: strength, focus, recovery, every day.</p>
          <div className="social-row" aria-label="RageForge community channels"><span aria-label="Instagram coming soon">◎</span><span aria-label="Facebook coming soon">f</span><span aria-label="YouTube coming soon">▶</span></div>
        </div>
        <div className="ftr-links"><h4>Quick links</h4><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/#about">About us</Link><Link to="/verify-product">Verify product</Link><Link to="/distributor">Distributor</Link></div>
        <div className="ftr-links"><h4>Categories</h4>{catalog.categories.map((c) => <Link key={c.slug} to={`/shop?category=${c.slug}`}>{c.name}</Link>)}</div>
        <div className="ftr-contact">
          <h4>Contact us</h4>

          <a className="contact-row" href="mailto:rageforgenutrition@gmail.com">
            <span>✉</span> rageforgenutrition@gmail.com
          </a>

          <a className="contact-row" href="tel:+917055372982">
            <span>☎</span> +91 7055372982
          </a>

          <address className="contact-row contact-address">
            <span>⌖</span>
            <span>

              India
            </span>
          </address>
        </div>
      </div>
      <div className="wrap ftr-base"><span>© 2026 RAGEFORGE Performance Nutrition</span><span>Built for your next level · Demo build</span></div>
    </footer>
  );
}
