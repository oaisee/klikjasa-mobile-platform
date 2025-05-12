
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { VerificationStatus } from '@/hooks/admin/useProviderVerifications';

interface VerificationFilterProps {
  filter: VerificationStatus | 'all';
  setFilter: (filter: VerificationStatus | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const VerificationFilter: React.FC<VerificationFilterProps> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
          size="sm"
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'approved' ? 'default' : 'outline'} 
          onClick={() => setFilter('approved')}
          className={filter === 'approved' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
          size="sm"
        >
          Approved
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'default' : 'outline'} 
          onClick={() => setFilter('rejected')}
          className={filter === 'rejected' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
          size="sm"
        >
          Rejected
        </Button>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
          size="sm"
        >
          All
        </Button>
      </div>
      <div className="w-full md:w-64 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search by name, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9"
        />
      </div>
    </div>
  );
};

export default VerificationFilter;
