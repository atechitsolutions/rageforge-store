import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Footer() {
  const { catalog, notify } = useStore();
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <img className="ftr-mark" src="/brand/wordmark.webp" alt="RAGEFORGE Performance Nutrition" loading="lazy" />
          <p>Fuel your next level. Strength, focus, recovery, everyday.</p>
          <form className="news" onSubmit={(e) => { e.preventDefault(); notify("Thanks - you're on the list (demo)"); e.target.reset(); }}>
            <input type="email" required placeholder="Email for drops & offers" aria-label="Email" /><button className="btn sm">Join</button>
          </form>
        </div>
        <div><h4>Shop</h4>{catalog.categories.map((c) => <Link key={c.slug} to={`/shop?category=${c.slug}`}>{c.name}</Link>)}</div>
        <div><h4>Help</h4><Link to="/shop">All products</Link><Link to="/wishlist">Wishlist</Link><Link to="/checkout">Checkout</Link><a href="#top">Back to top ↑</a></div>
        <div><h4>Notes</h4><p className="fine">This is a demo storefront. Prices, offers and catalogue entries other than the flagship whey are sample data. No real payment is taken. Supplement claims must be verified against final labels before launch.</p></div>
      </div>
      <div className="wrap ftr-base">© 2026 RAGEFORGE Performance Nutrition · Demo build</div>
    </footer>
  );
}
