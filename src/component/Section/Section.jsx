import React from "react";
import "./Section.css";
import manImg from "../../assets/machine tilla.webp";
import womanImg from "../../assets/handmade.webp";
import kidsImg from "../../assets/AariWork.jpg";
import { useNavigate } from "react-router-dom";

const Section = () => {

  const navigate = useNavigate();
  const categories = [
    { id: 1, title: "Machine", image: manImg },
    { id: 2, title: "Hand Tilla", image: womanImg },
    { id: 3, title: "Aari Work", image: kidsImg },
  ];

  return (
    <div className="category-section">
      <h2 className="category-heading"> Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.image} alt={cat.title} />
            <div className="overlay">
              <h3>{cat.title}</h3>
              <button onClick={() => navigate(`/category/${cat.title}`)} >Explore</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
