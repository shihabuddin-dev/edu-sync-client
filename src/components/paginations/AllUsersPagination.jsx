import React from 'react';

const AllUsersPagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center gap-2 py-4 bg-base-200 border-t border-base-300">
            <button
                className="btn btn-sm btn-outline hover:btn-primary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span className="px-2 text-sm">Page {currentPage} of {totalPages}</span>
            <button
                className="btn btn-sm btn-outline hover:btn-primary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default AllUsersPagination;