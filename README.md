# RAGEFORGE Performance Nutrition - demo e-commerce store

React (Vite) + Spring Boot 3 (Java 17) + MySQL. Black-and-crimson identity, 3D product presentation, search, filters,
wishlist, cart, coupon, demo checkout, promo banners and footer. **No real payments are taken.**

## Run it

1. **MySQL** - have it running. Defaults: user `root`, password `root`, database `rageforge` (created automatically).
2. **Backend**
   ```
   cd backend
   # change DB_USER / DB_PASSWORD if yours differ
   DB_PASSWORD=yourpassword mvn spring-boot:run
   ```
   Runs on http://localhost:8080. First start creates the tables and loads `catalog.json` (16 sample products, 7 categories).
3. **Frontend**
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173. Vite proxies `/api` to the backend.

If the backend is not running, the site still works from the bundled catalogue and saves demo orders on the device.

## API
- `GET /api/categories`
- `GET /api/products?q=&category=&best=true&maxPrice=&sort=featured|low|high|name`
- `GET /api/products/{slug}`
- `POST /api/orders` - prices are re-read from MySQL on the server; coupon `RAGE10` = 10% off; delivery free above 999 else 79 (sample rules)

## 3D / ThreeUI (free MIT package `@designcodeio/threeui` 1.2.0)
Used: `StructureFlowCollection` (topology-field hero), `LaserCollection` (offer banner), `SemanticBloom` (brand wordmark).
They load lazily, only while on screen, and are switched off on phones (<=820px), reduced-motion, data-saver and low-memory devices
(CSS gradient fallback). Product tilt/glare is plain CSS transforms.

**Not included:** `KiboriLandingPage`, `ThreeDPaper`, `DarkSoulsHoloCard` and `GlassAiButton` are not in the free npm package and their
source bundles could not be fetched, so they were not recreated. To add them, place the official source files from the threeui.com
bundles in `frontend/src/components/` and render them from `pages/Home.jsx`.

## Data you must review before launch
- Only the flagship whey uses the real pack artwork. All other products are **sample listings** with demo prices/MRP.
- Figures for the flagship (24 g protein, 5.5 g BCAAs, 4 g glutamine, 0 added sugar, 1 kg) come from the pack artwork - verify against the final label.
- Benefit lines ("Builds lean muscle", etc.) are brand copy and need legal/label verification.
- Brand name: the logo reads RAGEFORGE, the tub reads RAGEFORCE. The site uses RAGEFORGE - confirm which is correct.
- Edit products in `database/catalog.json` (keep `backend/src/main/resources/catalog.json` and `frontend/src/data/catalog.json` identical).
  To re-seed MySQL after editing: `DROP DATABASE rageforge;` and restart the backend.

## Structure
```
backend/   Spring Boot (model, repo, dto, service, web) + application.properties
frontend/  React app (src/pages, src/components, src/store.jsx, src/api.js)
database/  catalog.json (source of truth), schema.sql (optional)
```
