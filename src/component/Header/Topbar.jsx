import React, { useEffect, useState } from "react";
import outfit from "../../assets/Logo2.png";
import SearchIcon from "../../assets/search.png";
import "../Header/Topbar.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { BASE_URL } from "../../api/baseUrl";
import CartDrawer from "./CartDrawer";
import SearchResults from "../SearchBar/SearchResults";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [countCart, setCountCart] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/api/Bag/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setCountCart(data.count || 0);
      } catch (error) {
        console.log("Error fetching count:", error.message);
      }
    };
    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cloth/search?name=${search}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (search.trim() !== "") fetchSearch();
    else setProducts([]);
  }, [search]);

  const handleCartClick = async () => {
    setShowCart(!showCart);
    if (!showCart) {
      try {
        const response = await fetch(`${BASE_URL}/api/Bag/getbag`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (response.ok) setCartItems(data.items || []);
        else setCartItems([]);
      } catch (err) {
        setCartItems([]);
      }
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    const updatedItem = updatedCart.find((item) => item._id === itemId);
    try {
      await fetch(`${BASE_URL}/api/Bag/patchBag/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: updatedItem.quantity }),
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
    const newCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCountCart(newCount);
  };

  return (
    <div className="Topbar">

      {/* ── LEFT: Logo + Nav + Hamburger ── */}
      <div className="leftSection">
        <div className="logo" onClick={()=>navigate("/")} style={{ cursor: "pointer" }} >
          <img src={outfit} alt="Shop Logo" />
        </div>

        <div className={`navlinks ${menuOpen ? "active" : ""}`}>
          <span onClick={() => navigate("/category/Men")}>Men</span>
          <span onClick={() => navigate("/category/Women")}>Women</span>
          <span onClick={() => navigate("/category/Kids")}>Kids</span>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>

      {/* ── CENTER: Search Bar (desktop) ── */}
      <div className={`search-bar ${showSearch ? "active" : ""}`}>
        <div className="input">
          <img src={SearchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="close-search" onClick={() => { setShowSearch(false); setSearch(""); }}>✕</span>
        </div>
      </div>

      {/* ── Mobile Search Icon ── */}
      <div className="mobile-search-icon" onClick={() => setShowSearch(true)}>
        <img src={SearchIcon} alt="Search" />  {/* ✅ FIXED: was src={search} */}
      </div>

      {/* ── RIGHT: Wishlist + Cart + Logout ── */}
      <div className="right-section">

        <FaHeart className="icon" title="Wishlist" />

        <div style={{ position: "relative" }}>
          <FaShoppingCart
            className="icon"
            title="Cart"
            onClick={handleCartClick}
          />
          {countCart > 0 && (
            <span className="cart-badge">{countCart}</span>
          )}
          <CartDrawer
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            cartItems={cartItems}
            setCartItems={setCartItems}
            countCart={countCart}
            setCountCart={setCountCart}
          />
        </div>

        <FaSignOutAlt className="icon" title="Logout" onClick={handleLogout} />
      </div>

      {/* ── Search Results Dropdown ── */}
      {search && (
        <SearchResults
          products={products}
          query={search}
          onSelect={(item) => {
            navigate(`/detailprof/${item._id}`);
            setSearch("");
          }}
          onClose={() => setSearch("")}
        />
      )}

    </div>
  );
};

export default Topbar;