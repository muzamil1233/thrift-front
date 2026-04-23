import React from "react";
import "./Pagination.css"

const Pagination = ({ currPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button className="page" onClick={() => onPageChange(Math.max(currPage - 1, 1))}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className="page-in"
          onClick={() => onPageChange(i + 1)}
          style={{ fontWeight: currPage === i + 1 ? "bold" : "normal" }}
        >
          {i + 1}
        </button>
      ))}

      <button  className="page" onClick={() => onPageChange(Math.min(currPage + 1, totalPages))}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
