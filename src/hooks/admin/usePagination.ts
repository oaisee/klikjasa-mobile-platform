
import { useState, useEffect } from 'react';

interface UsePaginationProps<T> {
  items: T[] | undefined;
  itemsPerPage: number;
}

interface PaginationResult<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedItems: T[];
}

export function usePagination<T>({ 
  items, 
  itemsPerPage 
}: UsePaginationProps<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);
  
  // Calculate paginated items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items ? items.slice(startIndex, startIndex + itemsPerPage) : [];
  
  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems
  };
}
