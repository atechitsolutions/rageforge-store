import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Header() {
  const { totals, wish, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate(); const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname, loc.search]);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 12); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const submit = (e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q.trim())}`); };

  return (
    <header className={"hdr" + (scrolled ? " scrolled" : "")}>
      <div className="topbar">Demo store · Use code <b>RAGE10</b> for 10% off · Free delivery above ₹5000</div>
      <div className="hdr-row wrap">
        <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><span /><span /><span /></button>
        <Link to="/" className="logo" aria-label="RAGEFORGE home"><img src="rageforgelogo.jpeg" alt="" /></Link>
        <nav className={"nav" + (open ? " open" : "")} aria-label="Main">
          <form className="search mobile-only" onSubmit={submit}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search supplements" aria-label="Search" /><button className="btn sm">Go</button></form>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/#about">About us</NavLink>
          <NavLink to="/verify-product">Verify product</NavLink>
          <NavLink to="/distributor">Become a distributor</NavLink>
          <a href="#contact">Contact</a>
        </nav>
        <form className="search desk-only" onSubmit={submit} role="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search whey, creatine, shaker…" aria-label="Search products" />
          <button aria-label="Search"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" /></svg></button>
        </form>
        <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wish.length} items`}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
          {wish.length > 0 && <i className="count">{wish.length}</i>}
        </Link>
        <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Cart, ${totals.count} items`}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 4h2l2.2 11h10.6L20 7H6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="9" cy="19.5" r="1.4" fill="currentColor" /><circle cx="17" cy="19.5" r="1.4" fill="currentColor" /></svg>
          {totals.count > 0 && <i className="count">{totals.count}</i>}
        </button>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
    </header>
  );
}
