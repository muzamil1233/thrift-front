// SearchResults.jsx
import React, { useRef, useEffect } from "react";
import "./SearchResults.css";
import { BASE_URL } from "../../api/baseUrl";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const SearchResults = ({ products, query, onSelect, onClose }) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!query.trim()) return null;

  return (
    <div className="sr-overlay" ref={ref}>
      {/* Header */}
      <div className="sr-header">
        <span className="sr-title">
          Results for <strong>"{query}"</strong>
        </span>
        <span className="sr-count">{products.length} item{products.length !== 1 ? "s" : ""}</span>
        <button className="sr-close" onClick={onClose}>✕</button>
      </div>

      {/* No results */}
      {products.length === 0 ? (
        <div className="sr-empty">
          <span>😕</span>
          <p>No products found for "<strong>{query}</strong>"</p>
        </div>
      ) : (
        <div className="sr-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="sr-card"
              onClick={() => onSelect(product)}
            >
              {/* Image */}
              <div className="sr-img-wrap">
                {product.images?.[0] ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="sr-img"
                  />
                ) : (
                  <div className="sr-img-placeholder">👗</div>
                )}
              </div>

              {/* Info */}
              <div className="sr-info">
                <h3 className="sr-name" title={product.name}>{product.name}</h3>
                <p className="sr-price">₹{product.price?.toLocaleString()}</p>

                {product.color?.length > 0 && (
                  <div className="sr-colors">
                    {product.color.map((color, idx) => (
                      <span
                        key={idx}
                        className="sr-chip"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;