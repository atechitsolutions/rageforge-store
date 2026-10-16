// Stylised tub / pack made with CSS, so catalogue items without photography still look on-brand.
// The flagship product uses the real pack artwork supplied by the brand.
export default function ProductTub({ product, size = "md" }) {
  if (product.imageKey) {
    return <img className={"tub-photo " + size} src={`/brand/${product.imageKey}.webp`} alt={`${product.name} ${product.tagline}`} loading="lazy" />;
  }
  const gear = product.category === "accessories";
  return (
    <div className={"tub " + size + (gear ? " gear" : "")} style={{ "--accent": product.accent }}>
      <div className="tub-lid" />
      <div className="tub-body">
        <img className="tub-emblem" src="/brand/emblem.webp" alt="" />
        <b className="tub-brand">RAGEFORGE</b>
        <span className="tub-name">{product.name}</span>
        <i className="tub-bar" />
        <small>{product.sizes[0].label}</small>
      </div>
    </div>
  );
}
