import { Link, useParams } from "react-router-dom";
import { rupee } from "../store.jsx";

export default function Order() {
  const { id } = useParams();
  let o = null; try { o = JSON.parse(sessionStorage.getItem("rf_order_" + id)); } catch {}
  if (!o) return <div className="wrap page"><h1 className="h1">Order {id}</h1><p className="muted">Order details are only kept for this browser session.</p><Link className="btn" to="/shop">Continue shopping</Link></div>;
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Demo order placed</p>
      <h1 className="h1">Thanks, {o.customerName?.split(" ")[0]}.</h1>
      <p>Order <b>#{o.id}</b> {o.saved === "server" ? "was saved to the RAGEFORGE database." : "was saved on this device because the backend wasn't reachable."} No payment was taken.</p>
      <ul className="lines">{o.items.map((i, k) => <li key={k}><div className="meta"><b>{i.name}</b><small>{i.size} · {i.flavour} × {i.qty}</small></div><div className="lp"><b>{rupee(i.price * i.qty)}</b></div></li>)}</ul>
      <dl className="sum"><div><dt>Subtotal</dt><dd>{rupee(o.subtotal)}</dd></div>{o.discount > 0 && <div><dt>Discount</dt><dd>−{rupee(o.discount)}</dd></div>}<div><dt>Delivery</dt><dd>{o.shipping ? rupee(o.shipping) : "Free"}</dd></div><div className="tot"><dt>Total</dt><dd>{rupee(o.total)}</dd></div></dl>
      <Link className="btn" to="/shop">Continue shopping</Link>
    </div>
  );
}
