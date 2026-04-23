// ProductModal.jsx
// Shows product detail when a search result is clicked

import React from "react";
import "./ProductModal.css";

import { BASE_URL } from "../../api/baseUrl";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/Bag/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cart-updated"));
        onClose();
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-card" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="pm-close" onClick={onClose}>✕</button>

        {/* Image */}
        <div className="pm-img-wrap">
          {product.image ? (
            <img src={product.image} alt={product.name} className="pm-img" />
          ) : (
            <div className="pm-img-placeholder">👗</div>
          )}
        </div>

        {/* Details */}
        <div className="pm-details">
          <h2 className="pm-name">{product.name}</h2>

          {product.price && (
            <div className="pm-price-row">
              <span className="pm-price">PKR {product.price.toLocaleString()}</span>
            </div>
          )}

          {product.description && (
            <p className="pm-desc">{product.description}</p>
          )}

          <div className="pm-actions">
            <button className="pm-btn pm-btn-cart" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="pm-btn pm-btn-wish">
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;