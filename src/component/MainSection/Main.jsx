import React, { useEffect, useState } from "react";
import "../MainSection/Main.css";
import Pagination from "../Pagination"; // import your component
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
    e.stopPropagation(); // ✅ prevent navigating to detail page
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation(); // ✅ prevent navigating to detail page
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "250px", overflow: "hidden" }}>
      
      {/* Image */}
      <img
        // src={`${BASE_URL}${images[current]}`}
        // src={images[current]}
        src={getImageUrl(images[current])}
        alt={`slide-${current}`}
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      />

      {/* Only show arrows if more than 1 image */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            style={{
              position: "absolute", top: "50%", left: "6px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", color: "white",
              border: "none", borderRadius: "50%",
              width: "28px", height: "28px",
              cursor: "pointer", fontSize: "14px"
            }}
          >‹</button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            style={{
              position: "absolute", top: "50%", right: "6px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", color: "white",
              border: "none", borderRadius: "50%",
              width: "28px", height: "28px",
              cursor: "pointer", fontSize: "14px"
            }}
          >›</button>

          {/* Dots */}
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
  const productsPerPage = 8;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/cloth/getClothes`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
          <div className="product-card"
           key={product.id}
           onClick={() => navigate(`/detailprof/${product._id}`)}
           >
             {/* <img
        src={`${BASE_URL}${product.images?.[0]}`}
        alt={product.name}
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      /> */}
      <ImageSlider images={product.images} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div className="color-selection">
              {product.color?.map((color, idx) => (
                <button
                  key={idx}
                  className="chip-button"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
