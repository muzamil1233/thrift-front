import React from "react";
import   "./subMain.css";
// import backgroundImage from "../../assets/Rb.ppg"
import backgroundImage from "../../assets/Rb.png"


const SubMain = () => {
  return (
    <div className="wear-section1">
      {/* <h1>About us</h1> */}
      <div className="wear-section">
         <div className="wear-content">
        <h2>Crafting Elegance Through Kashmiri Heritage</h2>
        <p>At RB Tila Designer, we bring the timeless beauty of traditional Kashmiri craftsmanship to life with elegance, detail, and passion. Every outfit we create reflects the rich cultural artistry of Kashmir, designed for those who value luxury, tradition, and uniqueness.

We specialize in Handmade Tilla Work, Machine Tilla Work, Aari Work, Dapka Work, and a wide range of intricate custom embroidery styles — all carefully crafted in-house by our skilled artisans.

From classic traditional wear to customized designer pieces, every design is created with precision, dedication, and a deep love for fine craftsmanship.</p>
        {/* <button>Shop Now</button> */}
      </div>
      <div className="wear-image">
        <img
        src={backgroundImage}
          alt="Wear to Wedding"
        />
      </div>
      </div>
    
    </div>
  );
};

export default SubMain;
