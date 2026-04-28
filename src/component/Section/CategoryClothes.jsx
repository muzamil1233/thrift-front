import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./categoryClothes.css";
import { BASE_URL } from "../../api/baseUrl";

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const CategoryClothes = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const url =
          category === "All"
            ? `${BASE_URL}/api/cloth/getClothes`
            : `${BASE_URL}/api/cloth/getClothes/category/${category}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.msg);
          setClothes([]);
        } else {
          setClothes(data);
          setErrorMsg("");
        }
      } catch (error) {
        console.error("Error fetching clothes:", error);
        setErrorMsg("Server error");
        setClothes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, [category]);

  if (loading) return <p>Loading {category} clothes...</p>;

  return (
    <div className="category-page">
      <h2 className="category-title">{category} Clothes</h2>

      {errorMsg ? (
        <div className="error-msg">
          <p className="error-msg-text">No Treasures Found Here Yet</p>
          <p className="error-msg-sub">This collection is currently empty</p>
        </div>
      ) : (
        <div className="clothes-grid">
          {clothes.map((item) => (
            <div
              key={item._id}
              className="clothes-card"
              onClick={() => navigate(`/detailprof/${item._id}`)}
            >
              <img
                src={getImageUrl(item.images?.[0])}
                alt={item.name}
                className="clothes-img"
              />
              <div className="clothes-card-body">
                <h4 className="clothes-name">{item.name}</h4>
                <p className="clothes-price">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryClothes;