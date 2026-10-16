import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../store.jsx";

export default function Wishlist() {
  const { catalog, wish } = useStore();
  const items = catalog.products.filter((p) => wish.includes(p.id));
  return (
    <div className="wrap page">
      <h1 className="h1">Wishlist</h1>
      {items.length ? <div className="grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <div className="empty"><p>Nothing saved yet. Tap the heart on any product.</p><Link className="btn" to="/shop">Browse products</Link></div>}
    </div>
  );
}
