import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate, } from "react-router-dom";


import "./AdminView.css"; // import CSS
import Pagination from "../Pagination";
import { BASE_URL } from "../../api/baseUrl";
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const AdminView = () => {
    const navigate = useNavigate()
      const [currentPage, setCurrentPage] = useState(1);
   const itemperpage = 10;

  
    
    
  const { category } = useParams();
  const location = useLocation();
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
   const indexOfLastProduct = currentPage * itemperpage;
  const indexOfFirstProduct = indexOfLastProduct - itemperpage;

   const currentProducts = clothes.slice(indexOfFirstProduct,indexOfLastProduct);
   const totalPage =Math.ceil(clothes.length/itemperpage) 

useEffect(() => {
  const fetchClothes = async () => {
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
      if (response.ok) setClothes(data);
      else setErrorMsg(data.msg);
    } catch (error) {
      console.error("Error fetching clothes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchClothes();
}, [category, location.state?.updated]); // 👈 trigger refetch when updated


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/cloth/deleteClothes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Failed to delete item");
        return;
      }

      // Remove deleted item from UI
      setClothes((prev) => prev.filter((cloth) => cloth._id !== id));
      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Server error while deleting item");
    }
  };
   const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading) return <p>Loading {category} clothes...</p>;

  return (
    <div className="category-page">
      <h2 className="category-title">{category} Clothes</h2>
      

      {errorMsg ? (
        <p className="error-msg">{errorMsg}</p>
      ) : (
        <div className="clothes-grid">
          {currentProducts.map((item) => (
            <div key={item._id} className="clothes-card">
              <img
  // src={`${BASE_URL}${item.images?.[0]}`}
  // src={item.images?.[0]}
  // src={getImageUrl(item.images?.[0])}
  src={getImageUrl(item.images?.[0]) || null}
  alt={item.name}
  className="clothes-img"
/>

              <h4 className="clothes-name">{item.name}</h4>
              <p className="clothes-price">₹{item.price}</p>
               <button className="edit-btn" onClick={() => handleEdit(item._id)}>
                  Edit
                </button>
               <button
                className="delete-btn"
                
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
        {/* <Pagination
        currPage={currentProducts}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
      /> */}
      <Pagination
  currPage={currentPage}  // ✅ pass number
  totalPages={totalPage}
  onPageChange={(page) => setCurrentPage(page)}
/>
    </div>
    
  );
};

export default AdminView;
