import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadCatalog, COUPONS, FREE_SHIP_OVER, SHIPPING_FEE } from "./api.js";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
export const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export function StoreProvider({ children }) {
  const [catalog, setCatalog] = useState({ categories: [], products: [], source: "loading" });
  const [cart, setCart] = useState(() => read("rf_cart", []));
  const [wish, setWish] = useState(() => read("rf_wish", []));
  const [coupon, setCoupon] = useState(() => read("rf_coupon", ""));
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { loadCatalog().then(setCatalog); }, []);
  useEffect(() => localStorage.setItem("rf_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("rf_wish", JSON.stringify(wish)), [wish]);
  useEffect(() => localStorage.setItem("rf_coupon", JSON.stringify(coupon)), [coupon]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); }, [toast]);

  const notify = useCallback((m) => setToast(m), []);

  const addToCart = useCallback((p, size, flavour, qty = 1, open = true) => {
    const key = [p.id, size.label, flavour].join("|");
    setCart((c) => {
      const hit = c.find((i) => i.key === key);
      if (hit) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i));
      return [...c, { key, id: p.id, slug: p.slug, name: p.name, accent: p.accent, imageKey: p.imageKey, size: size.label, flavour, price: size.price, qty }];
    });
    notify(p.name + " added to cart");
    if (open) setCartOpen(true);
  }, [notify]);

  const setQty = (key, qty) => setCart((c) => (qty < 1 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i))));
  const removeItem = (key) => setCart((c) => c.filter((i) => i.key !== key));
  const clearCart = () => { setCart([]); setCoupon(""); };
  const toggleWish = (id) => setWish((w) => { const on = w.includes(id); notify(on ? "Removed from wishlist" : "Saved to wishlist"); return on ? w.filter((x) => x !== id) : [...w, id]; });

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const pct = COUPONS[coupon] || 0;
    const discount = Math.round((subtotal * pct) / 100);
    const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIP_OVER ? 0 : SHIPPING_FEE;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping, count: cart.reduce((s, i) => s + i.qty, 0) };
  }, [cart, coupon]);

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) { setCoupon(c); notify("Coupon " + c + " applied"); return true; }
    notify("That coupon is not valid"); return false;
  };

  const value = { catalog, cart, wish, coupon, cartOpen, setCartOpen, toast, notify, addToCart, setQty, removeItem, clearCart, toggleWish, totals, applyCoupon, setCoupon };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
