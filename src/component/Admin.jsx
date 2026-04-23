import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Admin.css";
import { BASE_URL } from "../api/baseUrl";

const Admin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "", category: "", type: "", size: "", color: "",
    material: "", price: "", stock: "", brand: "",
    description: "", isFeatured: false,
  });

  const [selectedImages, setSelectedImages] = useState([]); // new files
  const [existingImages, setExistingImages] = useState([]); // already saved image paths (e.g. /uploads/xx.jpg)

  useEffect(() => {
    if (!id) return;

    const fetchCloth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cloth/getCloth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFormData({
            name: data.name || "",
            category: data.category || "",
            type: data.type || "",
            size: Array.isArray(data.size) ? data.size.join(", ") : data.size || "",
            color: Array.isArray(data.color) ? data.color.join(", ") : data.color || "",
            material: data.material || "",
            price: data.price || "",
            stock: data.stock || "",
            brand: data.brand || "",
            description: data.description || "",
            isFeatured: data.isFeatured || false,
          });

          // ✅ Store raw paths like /uploads/image.jpg
          if (data.images?.length > 0) {
            setExistingImages(data.images); // keep raw paths for sending to backend
          }
        } else {
          alert("Failed to fetch cloth data");
        }
      } catch (error) {
        console.error("Error fetching cloth:", error);
      }
    };

    fetchCloth();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

 const handleFileChange = (e) => {
  const newFiles = [...e.target.files];
  setSelectedImages((prev) => [...prev, ...newFiles]); // ✅ merge don't overwrite
};

  // ✅ Delete an existing image from preview
  const handleRemoveExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Delete a newly selected image before upload
  const handleRemoveSelected = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      if (key === "size" || key === "color") {
        const arr = formData[key].split(",").map((item) => item.trim()).filter(Boolean);
        arr.forEach((v) => data.append(key, v));
      } else {
        data.append(key, formData[key]);
      }
    }

    // ✅ Send existing image paths so backend keeps them
    existingImages.forEach((imgPath) => data.append("existingImages", imgPath));

    // ✅ Send new image files
    selectedImages.forEach((img) => data.append("images", img));

    const url = id ? `${BASE_URL}/api/cloth/EditClothes/${id}` : `${BASE_URL}/api/cloth/AddCloths`;
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(id ? "✅ Cloth updated!" : "🧥 Cloth added!");
        setTimeout(() => navigate("/Admin"), 300);
      } else {
        alert(`❌ ${result.error || "Failed to save cloth"}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Error saving cloth!");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">{id ? "✏️ Edit Cloth" : "🧥 Add New Cloth"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="admin-form">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Machine">Machine </option>
          <option value="Hand Tilla">Hand Tilla</option>
          <option value="Aari Work">Aari work</option>
          <option value="others">Others</option>
        </select>
        <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
        <input name="size" placeholder="Sizes (comma separated)" value={formData.size} onChange={handleChange} />
        <input name="color" placeholder="Colors (comma separated)" value={formData.color} onChange={handleChange} />
        <input name="material" placeholder="Material" value={formData.material} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <label className="checkbox-label">
          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured
        </label>

     <input
  type="file"
  multiple                    // ✅ already there, keep it
  onChange={handleFileChange}
  className="file-input"
  key={selectedImages.length} // ✅ add this line — resets input after selection
/>

        {/* ✅ Existing images with delete button */}
        {existingImages.length > 0 && (
          <div className="uploaded-section">
            <h4>Current Images:</h4>
            <div className="preview-container">
              {existingImages.map((img, i) => (
                <div key={i} style={{ position: "relative", display: "inline-block" }}>
                  <img
                    // src={img.startsWith("http") ? img : `${BASE_URL}${img}`}
                    src={img}
                    alt="existing"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(i)}
                    style={{
                      position: "absolute", top: 0, right: 0,
                      background: "red", color: "white",
                      border: "none", borderRadius: "50%",
                      width: "22px", height: "22px",
                      cursor: "pointer", fontWeight: "bold"
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ New image previews with delete button */}
        {selectedImages.length > 0 && (
          <div className="preview-container">
            <h4>New Images:</h4>
            {selectedImages.map((img, i) => (
              <div key={i} style={{ position: "relative", display: "inline-block" }}>
                <img src={URL.createObjectURL(img)} alt="preview" className="preview-img" />
                <button
                  type="button"
                  onClick={() => handleRemoveSelected(i)}
                  style={{
                    position: "absolute", top: 0, right: 0,
                    background: "red", color: "white",
                    border: "none", borderRadius: "50%",
                    width: "22px", height: "22px",
                    cursor: "pointer", fontWeight: "bold"
                  }}
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">{id ? "Update Cloth" : "Add Cloth"}</button>
      </form>
    </div>
  );
};

export default Admin;