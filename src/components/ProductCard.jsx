import React from "react";

export default function ProductCard({ item, mode = "catalog", qty = 0, onAdd, onInc, onDec, onRemove }) {
  const price = Number(item.price || 0);
  const stock = Number(item.qty || 0);
  const rating = Number(item.rating || 4.6);
  const reviews = Number(item.reviews || 147);
  const category = item.category || "Chocolate";
  const desc = item.desc || "Handcrafted chocolate with premium cocoa.";

  const starsCount = Math.max(0, Math.min(5, Math.round(rating)));
  const stars = "★★★★★".slice(0, starsCount);
  const starsDim = "★★★★★".slice(starsCount);

  const canAdd = stock > 0 && qty < stock;

  return (
    <div className="shop-card">
      <div className="shop-img">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="shop-img-ph">
            <span>🍫</span>
          </div>
        )}
      </div>

      <div className="shop-body">
        <h3 className="shop-title">{item.name}</h3>

        <div className="shop-rating">
          <span className="shop-stars">{stars}</span>
          <span className="shop-stars dim">{starsDim}</span>
          <span className="shop-rev">{reviews}</span>
        </div>

        <div className="shop-cat">{category}</div>

        <div className="shop-price">₹{price.toFixed(2)}</div>

        <div className="shop-desc">{desc}</div>

        {mode === "cart" ? (
          <div className="shop-actions">
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => onDec?.(item.id)} type="button">
                −
              </button>
              <div className="qty-val">{qty}</div>
              <button
                className="qty-btn"
                onClick={() => onInc?.(item.id)}
                type="button"
                disabled={qty >= stock}
              >
                +
              </button>
            </div>

            <button className="shop-remove" onClick={() => onRemove?.(item.id)} type="button">
              Remove
            </button>
          </div>
        ) : (
          <div className="shop-actions">
            <button className="shop-add" onClick={() => onAdd?.(item)} type="button" disabled={!canAdd}>
              {stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <div className="shop-stock">Stock: {stock}</div>
          </div>
        )}
      </div>
    </div>
  );
}
