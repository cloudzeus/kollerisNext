import React, { useState } from 'react';

const usePagination = (data, pageSize) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dataLength = data?.length ? data?.length : 0;
  const totalPages = Math.ceil(dataLength / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
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