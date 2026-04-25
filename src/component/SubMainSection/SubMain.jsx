import React from "react";
import   "./subMain.css";
// import backgroundImage from "../../assets/Rb.ppg"
import backgroundImage from "../../assets/thrifthub.png"


const SubMain = () => {
  return (
    <div className="wear-section1">
      {/* <h1>About us</h1> */}
      <div className="wear-section">
         <div className="wear-content">
        <h2>The World Thrift Hub</h2>
        <p>The World Thrift Hub is more than just a clothing brand — it’s a movement towards sustainable fashion and conscious living.

We believe that great style doesn’t have to come at the cost of the planet. Our mission is to give pre-loved clothes a second life, turning timeless pieces into fresh fashion statements. Every item in our collection is carefully selected to ensure quality, uniqueness, and affordability.

At The World Thrift Hub, we promote a culture of rewear, relove, and reduce — helping you look good while doing good.

Whether you're searching for vintage vibes, everyday essentials, or one-of-a-kind finds, we bring you styles that tell a story.</p>
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
