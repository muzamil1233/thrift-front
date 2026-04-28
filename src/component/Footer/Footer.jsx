import React, { useState } from "react";
import "../Footer/Footer.css";
import logo from "../../assets/logo1.png";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const SERVICE_ID = "service_kk89e8j";
const TEMPLATE_ID = "template_rzx5vmk";
const PUBLIC_KEY = "uxIpCjUW10TZ7bYE9";

const WHATSAPP_NUMBER = "916006318647";
const WHATSAPP_DEFAULT_MSG =
  "Hello! I'm interested in your products. Can you help me?";

const Footer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { name: formData.name, email: formData.email, message: formData.message },
        PUBLIC_KEY
      );
      setStatus("Message sent! ✅");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("Failed to send! ❌");
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MSG
  )}`;

  return (
    <>
      {/* ── Floating WhatsApp Button ── */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="wa-icon" />
        <span>Chat with us</span>
      </a>

      <footer className="footer">
        <div className="footer-container">

          {/* ── Brand ── */}
          <div className="footer-brand">
            <img src={logo} alt="Tulos Logo" className="footer-logo" />
            <p className="footer-tagline">
              Your one-stop fashion destination for every occasion.
            </p>

            {/* Social Icons */}
            <div className="social-icons">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="social-icon wa" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://instagram.com/YOUR_HANDLE" target="_blank"
                rel="noopener noreferrer" className="social-icon ig" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://facebook.com/YOUR_PAGE" target="_blank"
                rel="noopener noreferrer" className="social-icon fb" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://youtube.com/YOUR_CHANNEL" target="_blank"
                rel="noopener noreferrer" className="social-icon yt" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="https://tiktok.com/@YOUR_HANDLE" target="_blank"
                rel="noopener noreferrer" className="social-icon tt" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="footer-links">
            <h3>Collections</h3>
            <ul>
              <li><Link to="/category/Men">Men</Link></li>
              <li><Link to="/category/Women">Women</Link></li>
              <li><Link to="/category/Kids">Kids</Link></li>
              {/* <li><Link to="/category/women">Women</Link></li> */}
              {/* <li><Link to="/category/kids">Kids</Link></li> */}
            </ul>
          </div>

          {/* ── Contact Info ── */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:muzamiln213@gmail.com">muzamiln213@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone / WhatsApp</span>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                +91 6006318647
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address</span>
              <p>Chinkipora Sopore,<br />Jammu &amp; Kashmir, India</p>
            </div>
            {/* WhatsApp CTA */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="wa-cta-btn">
              <FaWhatsapp /> Order on WhatsApp
            </a>
          </div>

          {/* ── Query Form ── */}
          <div className="footer-query-box">
            <h3>Ask a Query</h3>
            <form onSubmit={handleSubmit} className="query-form">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit">Send Message</button>
            </form>
            {status && <p className="query-status">{status}</p>}
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <p>© 2025 Tulos Fashion. All Rights Reserved.</p>
          <div className="footer-bottom-social">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://facebook.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;