import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore, rupee } from "../store.jsx";
import ProductTub from "./ProductTub.jsx";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeItem, totals, coupon, applyCoupon, setCoupon, catalog } = useStore();
  const [code, setCode] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    const k = (e) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [setCartOpen]);
  useEffect(() => { document.body.style.overflow = cartOpen ? "hidden" : ""; }, [cartOpen]);

  const prod = (id) => catalog.products.find((p) => p.id === id);
  return (
    <>
      <div className={"scrim" + (cartOpen ? " show" : "")} onClick={() => setCartOpen(false)} />
      <aside className={"drawer" + (cartOpen ? " open" : "")} aria-hidden={!cartOpen} aria-label="Shopping cart">
        <div className="drawer-head"><h2>Your cart ({totals.count})</h2><button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button></div>
        {cart.length === 0 ? (
          <div className="empty"><p>Your cart is empty.</p><Link className="btn" to="/shop" onClick={() => setCartOpen(false)}>Start shopping</Link></div>
        ) : (
          <>
            <ul className="lines">
              {cart.map((i) => (
                <li key={i.key}>
                  <div className="thumb">{prod(i.id) && <ProductTub product={prod(i.id)} size="xs" />}</div>
                  <div className="meta">
                    <Link to={`/product/${i.slug}`} onClick={() => setCartOpen(false)}>{i.name}</Link>
                    <small>{i.size} · {i.flavour}</small>
                    <div className="qty"><button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease">−</button><span>{i.qty}</span><button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase">+</button></div>
                  </div>
                  <div className="lp"><b>{rupee(i.price * i.qty)}</b><button className="link" onClick={() => removeItem(i.key)}>Remove</button></div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <form className="coupon" onSubmit={(e) => { e.preventDefault(); applyCoupon(code); setCode(""); }}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
                <button className="btn ghost sm">Apply</button>
              </form>
              {coupon && <p className="ok">Coupon {coupon} applied <button className="link" onClick={() => setCoupon("")}>remove</button></p>}
              <dl className="sum">
                <div><dt>Subtotal</dt><dd>{rupee(totals.subtotal)}</dd></div>
                {totals.discount > 0 && <div><dt>Discount</dt><dd>−{rupee(totals.discount)}</dd></div>}
                <div><dt>Delivery</dt><dd>{totals.shipping ? rupee(totals.shipping) : "Free"}</dd></div>
                <div className="tot"><dt>Total</dt><dd>{rupee(totals.total)}</dd></div>
              </dl>
              <button className="btn block" onClick={() => { setCartOpen(false); nav("/checkout"); }}>Checkout</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
