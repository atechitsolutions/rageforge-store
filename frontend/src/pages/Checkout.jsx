import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore, rupee } from "../store.jsx";
import { placeOrder } from "../api.js";

export default function Checkout() {
  const { cart, totals, coupon, applyCoupon, setCoupon, clearCart, setQty, removeItem } = useStore();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false); const [err, setErr] = useState({}); const [code, setCode] = useState("");
  const [f, setF] = useState({ customerName: "", email: "", phone: "", address: "", city: "", pincode: "" });
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (!cart.length) return <div className="wrap page"><h1 className="h1">Checkout</h1><div className="empty"><p>Your cart is empty.</p><Link className="btn" to="/shop">Shop products</Link></div></div>;

  const validate = () => {
    const e = {};
    if (f.customerName.trim().length < 2) e.customerName = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a 10-digit Indian mobile number";
    if (f.address.trim().length < 6) e.address = "Enter your address";
    if (!f.city.trim()) e.city = "Enter your city";
    if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a 6-digit pincode";
    setErr(e); return !Object.keys(e).length;
  };
  const submit = async (ev) => {
    ev.preventDefault(); if (!validate()) return; setBusy(true);
    const order = await placeOrder({ ...f, coupon, items: cart.map((i) => ({ productId: i.id, name: i.name, size: i.size, flavour: i.flavour, price: i.price, qty: i.qty })) });
    clearCart(); setBusy(false);
    sessionStorage.setItem("rf_order_" + order.id, JSON.stringify(order));
    nav(`/order/${order.id}`);
  };
  const Field = ({ k, label, type = "text", ...r }) => (<label className="field"><span>{label}</span><input type={type} value={f[k]} onChange={on(k)} aria-invalid={!!err[k]} {...r} />{err[k] && <em>{err[k]}</em>}</label>);

  return (
    <div className="wrap page">
      <h1 className="h1">Checkout</h1>
      <div className="co">
        <form onSubmit={submit} noValidate className="co-form">
          <h3>Delivery details</h3>
          <div className="two"><Field k="customerName" label="Full name" autoComplete="name" /><Field k="phone" label="Mobile" inputMode="numeric" maxLength={10} autoComplete="tel" /></div>
          <Field k="email" label="Email" type="email" autoComplete="email" />
          <Field k="address" label="Address" autoComplete="street-address" />
          <div className="two"><Field k="city" label="City" /><Field k="pincode" label="Pincode" inputMode="numeric" maxLength={6} /></div>
          <h3>Payment</h3>
          <p className="note">Demo store: no payment is taken. Your order is saved as a demo order (cash on delivery style).</p>
          <button className="btn block" disabled={busy}>{busy ? "Placing order…" : `Place demo order · ${rupee(totals.total)}`}</button>
        </form>
        <aside className="co-sum">
          <h3>Order summary</h3>
          <ul className="lines">{cart.map((i) => (<li key={i.key}><div className="meta"><b>{i.name}</b><small>{i.size} · {i.flavour}</small><div className="qty"><button type="button" onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease">−</button><span>{i.qty}</span><button type="button" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase">+</button></div></div><div className="lp"><b>{rupee(i.price * i.qty)}</b><button type="button" className="link" onClick={() => removeItem(i.key)}>Remove</button></div></li>))}</ul>
          <div className="coupon"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" /><button type="button" className="btn ghost sm" onClick={() => { applyCoupon(code); setCode(""); }}>Apply</button></div>
          {coupon && <p className="ok">Coupon {coupon} applied <button type="button" className="link" onClick={() => setCoupon("")}>remove</button></p>}
          <dl className="sum"><div><dt>Subtotal</dt><dd>{rupee(totals.subtotal)}</dd></div>{totals.discount > 0 && <div><dt>Discount</dt><dd>−{rupee(totals.discount)}</dd></div>}<div><dt>Delivery</dt><dd>{totals.shipping ? rupee(totals.shipping) : "Free"}</dd></div><div className="tot"><dt>Total</dt><dd>{rupee(totals.total)}</dd></div></dl>
        </aside>
      </div>
    </div>
  );
}
