import local from "./data/catalog.json";

const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function call(path, options) {
  const res = await fetch(BASE + path, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) throw new Error("API " + res.status);
  return res.json();
}

// Loads the catalogue from Spring Boot; falls back to the bundled copy so the UI still works offline.
export async function loadCatalog() {
  try {
    const [categories, products] = await Promise.all([call("/categories"), call("/products")]);
    if (!products.length) throw new Error("empty");
    return { categories, products, source: "api" };
  } catch {
    return { categories: local.categories, products: local.products, source: "local" };
  }
}

export const COUPONS = { RAGE10: 10 }; // demo coupon, mirrored in the backend
export const FREE_SHIP_OVER = 999;
export const SHIPPING_FEE = 79;

export async function placeOrder(payload) {
  try {
    const order = await call("/orders", { method: "POST", body: JSON.stringify(payload) });
    return { ...order, saved: "server" };
  } catch {
    const subtotal = payload.items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = Math.round((subtotal * (COUPONS[payload.coupon] || 0)) / 100);
    const shipping = subtotal - discount >= FREE_SHIP_OVER ? 0 : SHIPPING_FEE;
    const order = {
      id: "LOCAL-" + Date.now().toString(36).toUpperCase(),
      status: "DEMO_ORDER", subtotal, discount, shipping, total: subtotal - discount + shipping,
      items: payload.items, customerName: payload.customerName, saved: "device",
    };
    localStorage.setItem("rf_last_order", JSON.stringify(order));
    return order;
  }
}
