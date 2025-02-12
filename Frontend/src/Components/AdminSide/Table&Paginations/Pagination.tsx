import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex space-x-2">
        <button
          className={`text-lg text-blue-500 ${
            currentPage === 1 && "opacity-50 cursor-not-allowed"
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`text-lg ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-blue-500"
            } px-3 py-1 rounded-md`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`text-lg text-blue-500 ${
            currentPage === totalPages && "opacity-50 cursor-not-allowed"
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
