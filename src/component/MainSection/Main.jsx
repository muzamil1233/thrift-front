import React, { useEffect, useState } from "react";
import "../MainSection/Main.css";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/baseUrl";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: "relative", width: "100%",  }}>
      <img
        src={getImageUrl(images[current])}
        alt={`slide-${current}`}
  style={{ width: "100%", height: "auto", display: "block" }} 
      />
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} style={{
            position: "absolute", top: "50%", left: "6px",
            transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)",
            color: "white", border: "none", borderRadius: "50%",
            width: "28px", height: "28px", cursor: "pointer", fontSize: "14px"
          }}>‹</button>
          <button onClick={nextSlide} style={{
            position: "absolute", top: "50%", right: "6px",
            transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)",
            color: "white", border: "none", borderRadius: "50%",
            width: "28px", height: "28px", cursor: "pointer", fontSize: "14px"
          }}>›</button>
          <div style={{
            position: "absolute", bottom: "6px", width: "100%",
            display: "flex", justifyContent: "center", gap: "5px"
          }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: i === current ? "white" : "rgba(255,255,255,0.5)",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Main = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cloth/getClothes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="new-arrivals">
      <h2>New Arrivals for The World</h2>
      <div className="products-grid">
        {currentProducts.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/detailprof/${product._id}`)}
          >
           <div className="img-wrap">
  <ImageSlider images={product.images} />
  <span className="badge">{product.badge || "NEW ARRIVAL"}</span>
  <span className="wishlist">♡</span>
  <span className="rating">⭐ {product.rating || "4.5"}</span>  {/* must be inside img-wrap */}
</div>

            <div className="card-body">
              <p className="brand">TheWorldHub®</p>
              
              <p className="pname">{product.name}</p>
              <div className="price-row">
               <span className="price">₹{product.price}</span>
<span className="orig">₹{product.originalPrice}</span>
<span className="disc">{product.discount}% OFF</span>
              </div>
            
<div className="offer-tag">✦ {product.offer || "Buy 2 for 1199"}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <Pagination
          currPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Main;