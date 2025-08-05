import React from "react";

function Pagination({ currentPage, totalPages, onChangePage }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        aria-label="Page précédente"
      >
        ←
      </button>

      <span className="px-4 py-1 font-semibold">
        Page {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        aria-label="Page suivante"
      >
        →
      </button>
    </div>
  );
}

export default Pagination;

