import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import { useStore } from "./store.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import Order from "./pages/Order.jsx";
import Distributor from "./pages/Distributor.jsx";
import VerifyProduct from "./pages/VerifyProduct.jsx";

export default function App() {
  const { toast } = useStore();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/distributor" element={<Distributor />} />
          <Route path="/verify-product" element={<VerifyProduct />} />
          <Route path="*" element={<div className="wrap page"><h1 className="h1">404</h1><p>That page doesn't exist.</p></div>} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
