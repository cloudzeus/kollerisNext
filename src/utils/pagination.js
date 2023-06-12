import React, { useState } from 'react';

const usePagination = (data, pageSize) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  console.log(paginatedData)

  const handlePageChange = (event, page) => {
    console.log(page, event)
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
  };
};

export default usePagination;