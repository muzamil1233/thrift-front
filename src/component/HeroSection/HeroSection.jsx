import React from 'react'
import brand from "../../assets/Rb tilla.png"
import "../HeroSection/HeroSection.css"

const HeroSection = () => {
  return (
    <section className="hero-section">
      <img src={brand} alt="Hero Banner" className="hero-img" />
    </section>
  )
}

export default HeroSection