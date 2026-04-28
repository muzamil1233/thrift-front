import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DetailProf.css";
import { BASE_URL } from "../../api/baseUrl";
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};



const ImageSlider = ({ images, name }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px", overflow: "hidden", borderRadius: "0" }}>

      {/* Main Image */}
      <img
        // src={`${BASE_URL}${images[current]}`}
        // src={images[current]}
        src={getImageUrl(images[current])}
// src={getImageUrl(img)}
        alt={`${name}-${current}`}
        className="main-image"
       style={{ width: "100%", height: "100%", minHeight: "480px", objectFit: "cover", borderRadius: "0" }}
      />

      {/* Arrows — only if more than 1 image */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */} 
          <button
            onClick={prevSlide}
            style={{
              position: "absolute", top: "50%", left: "10px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", color: "white",
              border: "none", borderRadius: "50%",
              width: "36px", height: "36px",
              cursor: "pointer", fontSize: "20px"
            }}
          >‹</button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            style={{
              position: "absolute", top: "50%", right: "10px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", color: "white",
              border: "none", borderRadius: "50%",
              width: "36px", height: "36px",
              cursor: "pointer", fontSize: "20px"
            }}
          >›</button>

          {/* Dots */}
          <div style={{
            position: "absolute", bottom: "10px", width: "100%",
            display: "flex", justifyContent: "center", gap: "6px"
          }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: "9px", height: "9px", borderRadius: "50%",
                  background: i === current ? "white" : "rgba(255,255,255,0.4)",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Thumbnail Strip — only if more than 1 image */}
      {images.length > 1 && (
        <div style={{
          display: "flex", gap: "8px", marginTop: "10px",
          overflowX: "auto", padding: "4px"
        }}>
          {images.map((img, i) => (
            <img
              key={i}
              // src={`${BASE_URL}${img}`}
              // src={img}
              src={getImageUrl(img)}
              alt={`thumb-${i}`}
              onClick={() => setCurrent(i)}
              style={{
                width: "60px", height: "60px", objectFit: "cover",
                borderRadius: "6px", cursor: "pointer",
                border: i === current ? "2px solid black" : "2px solid transparent",
                opacity: i === current ? 1 : 0.6,
                flexShrink: 0
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DetailProf = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const[loading, setLoading ] = useState(false)
   const [cartItems, setCartItems] = useState([]);
   console.log("cartitem : ",cartItems)
    const [countCart, setCountCart] = useState([]);
    console.log("countcart", countCart)
    const [selectedSize, setSelectedSize] = useState(null);
   

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cloth/getCloth/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // no userId needed

      const res = await fetch(`${BASE_URL}/api/Bag/getbag`, { // Fix 3 - no /${userId}
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return; // guard against HTML error pages

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  fetchCart();
}, []);





const handleEdit = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    navigate("/login"); // ✅ redirect
    return;
  }

  if (!selectedColor) {
    alert("Please select a color");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/api/Bag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        color: selectedColor,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Item added to your bag!");
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Error adding to bag:", error);
  } finally {
    setLoading(false);
  }
};


const handleQuantityChange = async (itemId, delta) => {
  // Find and update UI quantity first
  const updatedCart = cartItems.map(item => {
    if (item._id === itemId) {
      const newQty = item.quantity + delta;
      return { ...item, quantity: newQty > 0 ? newQty : 1 }; // never 0
    }
    return item;
  });

  setCartItems(updatedCart);
 

  // Find the updated item to send correct quantity to backend
  const updatedItem = updatedCart.find(item => item._id === itemId);

  try {
    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/api/Bag/patchBag/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: updatedItem.quantity }), // IMPORTANT
    });
  } catch (err) {
    console.error("Error updating quantity:", err);
  }

  // Update total count
  const newCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
  setCountCart(newCount);
};


  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-box">
        {/* Left Section - Image */}
        <div className="product-images">
            
          {/* <img
            src={`${BASE_URL}${product.images?.[0]}`}
            alt={product.name}
            className="main-image"
          /> */}
           <div className="product-images">
  <ImageSlider images={product.images} name={product.name} />
</div>
        </div>

        {/* Right Section - Info */}
        <div className="product-info">
             <h2 className="product-name" >{product.name}</h2>
         
          <div className="product-catogory">

  <p className="pro-det">
    <strong>Category</strong>
    <span>{product.category}</span>
  </p>

  <p className="pro-det">
    <strong>Type</strong>
    <span>{product.type}</span>
  </p>

  <p className="pro-det">
    <strong>Brand</strong>
    <span>{product.brand || "N/A"}</span>
  </p>

  <p className="pro-det">
    <strong>Material</strong>
    <span>{product.material || "N/A"}</span>
  </p>

  <div className="size-section">
  <strong>Sizes:</strong>
  <div className="size-options">
    {product.size?.length > 0 ? (
      product.size.map((s, index) => (
        <button
          key={index}
          className={`size-btn ${selectedSize === s ? "selected" : ""}`}
          onClick={() => setSelectedSize(s)}
        >
          {s}
        </button>
      ))
    ) : (
      <span>N/A</span>
    )}
  </div>
</div>

</div>


          {/* Color Selection */}
          <div className="color-section">
            <strong>Colors:</strong>
            <div className="color-options">
              {product.color?.length > 0 ? (
                product.color.map((clr, index) => (
                  <div
                    key={index}
                    className={`color-circle ${selectedColor === clr ? "selected" : ""}`}
                    style={{ backgroundColor: clr.toLowerCase() }}
                    title={clr}
                    onClick={() => setSelectedColor(clr)}
                  ></div>
                ))
              ) : (
                <span> N/A</span>
              )}
            </div>
          </div>

          <p className="price"><strong>Price:</strong> ₹{product.price}</p>

          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
         <div>
  {Array.isArray(cartItems) && (() => {
    const currentItem = cartItems.find((item) => {
      const itemProductId = item.productId?._id || item.productId;
      return String(itemProductId) === String(product._id);
    });

    if (!currentItem) return null;

    return (
      <div className="quantity-controls">
        <button
          onClick={() => handleQuantityChange(currentItem._id, -1)}
          style={{ padding: "3px 8px", borderRadius: "4px" }}
        >
          -
        </button>

        <span style={{ margin: "0 8px" }}>Quantity {currentItem.quantity}</span>

        <button
          onClick={() => handleQuantityChange(currentItem._id, 1)}
          style={{ padding: "3px 8px", borderRadius: "4px" }}
        >
          +
        </button>
      </div>
    );
  })()}
</div>


         
           
        

          <div className="action-buttons">
            <button className="add-btn" onClick={ handleEdit} disabled={loading}> {loading ? "Adding..." : "Add to Bag"}</button>
         <button
  className="buy-btn"
 onClick={() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    navigate("/login"); // ✅ redirect
    return;
  }

  navigate(`/payment/${product._id}`);
}}

>
  Buy Now
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProf;
