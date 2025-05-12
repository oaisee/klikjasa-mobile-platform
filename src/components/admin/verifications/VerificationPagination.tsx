
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface VerificationPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const VerificationPagination: React.FC<VerificationPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages || 1}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default VerificationPagination;
