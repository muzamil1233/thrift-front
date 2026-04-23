import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/baseUrl";

const CartDrawer = ({ isOpen, onClose, cartItems, setCartItems, countCart, setCountCart }) => {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  // Auto-select all when cart loads
  useEffect(() => {
    setSelectedIds(cartItems.map(item => item._id));
  }, [cartItems]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const toggleSelect = (itemId) => {
    setSelectedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === cartItems.length ? [] : cartItems.map(i => i._id));
  };

  const handleQuantityChange = async (itemId, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updatedCart);
    setCountCart(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    try {
      const token = localStorage.getItem("token");
      const updatedItem = updatedCart.find(item => item._id === itemId);
      await fetch(`${BASE_URL}/api/Bag/patchBag/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: updatedItem.quantity }),
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    setSelectedIds(prev => prev.filter(id => id !== itemId));
    setCountCart(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/api/Bag/deleteBag/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) { console.error(err); }
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item._id));
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    if (selectedItems.length === 1) {
      navigate(`/payment/${selectedItems[0].productId._id}`);
      onClose();
    } else {
      alert("Multi-item checkout coming soon!");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:999;opacity:0;pointer-events:none;transition:opacity 0.3s ease}
        .cart-overlay.open{opacity:1;pointer-events:all}
        .cart-drawer{font-family:'DM Sans',sans-serif;position:fixed;top:0;right:0;height:100vh;width:420px;max-width:100vw;background:#fff;z-index:1000;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);box-shadow:-8px 0 40px rgba(0,0,0,0.15)}
        .cart-drawer.open{transform:translateX(0)}
        .cart-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
        .cart-header h2{font-size:18px;font-weight:600;color:#1a1a1a;margin:0}
        .cart-badge{background:#e8f4e8;color:#2d7a2d;font-size:12px;font-weight:500;padding:3px 10px;border-radius:20px;margin-left:8px}
        .close-btn{width:32px;height:32px;border-radius:50%;border:none;background:#f5f5f5;cursor:pointer;font-size:16px;color:#555;transition:background 0.2s}
        .close-btn:hover{background:#e8e8e8}
        .select-all-bar{display:flex;align-items:center;gap:10px;padding:10px 24px;background:#fafafa;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555}
        .select-all-bar label{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
        .select-all-bar input[type="checkbox"]{width:16px;height:16px;accent-color:#f0c14b;cursor:pointer}
        .selected-count{margin-left:auto;font-size:12px;color:#888}
        .cart-body{flex:1;overflow-y:auto;padding:8px 24px;scrollbar-width:thin;scrollbar-color:#e0e0e0 transparent}
        .cart-body::-webkit-scrollbar{width:4px}
        .cart-body::-webkit-scrollbar-thumb{background:#e0e0e0;border-radius:4px}
        .empty-cart{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:#999;padding:60px 0}
        .empty-cart p{font-size:15px;margin:0}
        .cart-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f5f5f5;transition:opacity 0.2s}
        .cart-item.deselected{opacity:0.4}
        .cart-item:last-child{border-bottom:none}
        .item-checkbox{padding-top:4px;flex-shrink:0}
        .item-checkbox input[type="checkbox"]{width:17px;height:17px;accent-color:#f0c14b;cursor:pointer}
        .item-image{width:76px;height:76px;border-radius:8px;object-fit:cover;background:#f5f5f5;flex-shrink:0}
        .item-info{flex:1;display:flex;flex-direction:column;gap:3px}
        .item-name{font-size:13px;font-weight:500;color:#1a1a1a;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .item-color{font-size:11px;color:#888}
        .item-price{font-size:15px;font-weight:600;color:#1a1a1a}
        .item-actions{display:flex;align-items:center;justify-content:space-between;margin-top:6px}
        .qty-control{display:flex;align-items:center;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden}
        .qty-btn{width:28px;height:28px;border:none;background:#f8f8f8;cursor:pointer;font-size:15px;color:#333;transition:background 0.15s}
        .qty-btn:hover{background:#efefef}
        .qty-num{min-width:28px;text-align:center;font-size:13px;font-weight:500;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;line-height:28px}
        .delete-btn{border:none;background:none;cursor:pointer;color:#c0392b;font-size:12px;font-weight:500;padding:4px 6px;border-radius:4px;transition:background 0.15s}
        .delete-btn:hover{background:#fdf0ee}
        .cart-footer{padding:16px 24px 20px;border-top:1px solid #f0f0f0}
        .subtotal-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
        .subtotal-label{font-size:13px;color:#666}
        .subtotal-amount{font-size:20px;font-weight:600;color:#1a1a1a}
        .free-delivery{font-size:12px;color:#2d7a2d;background:#f0faf0;padding:7px 12px;border-radius:6px;margin-bottom:12px}
        .checkout-btn{width:100%;padding:13px;background:#f0c14b;border:1px solid #a88734;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#111;cursor:pointer;transition:background 0.2s}
        .checkout-btn:hover{background:#e8b83e}
        .checkout-btn:disabled{background:#f5f5f5;border-color:#e0e0e0;color:#aaa;cursor:not-allowed}
        .continue-btn{width:100%;padding:10px;background:transparent;border:1px solid #d0d0d0;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;color:#555;cursor:pointer;margin-top:8px;transition:border-color 0.2s}
        .continue-btn:hover{border-color:#999;color:#222}
      `}</style>

      <div className={`cart-overlay ${isOpen ? "open" : ""}`} />

      <div ref={drawerRef} className={`cart-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>Your Bag</h2>
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Select All */}
        {cartItems.length > 0 && (
          <div className="select-all-bar">
            <label>
              <input
                type="checkbox"
                checked={selectedIds.length === cartItems.length}
                onChange={toggleSelectAll}
              />
              Select all items
            </label>
            <span className="selected-count">{selectedIds.length} of {cartItems.length} selected</span>
          </div>
        )}

        {/* Items */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your bag is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className={`cart-item ${!selectedIds.includes(item._id) ? "deselected" : ""}`}>
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                  />
                </div>
                {item.productId?.image
                  ? <img src={item.productId.image} alt={item.productId?.name} className="item-image" />
                  : <div className="item-image" />
                }
                <div className="item-info">
                  <p className="item-name">{item.productId?.name || "Product"}</p>
                  {item.color && <p className="item-color">Color: {item.color}</p>}
                  <p className="item-price">₹{(item.productId?.price || 0).toLocaleString()}</p>
                  <div className="item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => handleQuantityChange(item._id, -1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">
                Subtotal ({selectedItems.reduce((a, i) => a + i.quantity, 0)} items):
              </span>
              <span className="subtotal-amount">₹{subtotal.toLocaleString()}</span>
            </div>
            {subtotal > 0 && <div className="free-delivery">✓ Eligible for FREE Delivery</div>}
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={selectedIds.length === 0}
            >
              {selectedIds.length === 0 ? "Select items to checkout" : `Proceed to Checkout (${selectedIds.length})`}
            </button>
            <button className="continue-btn" onClick={onClose}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;