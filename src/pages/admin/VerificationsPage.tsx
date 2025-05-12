
import React, { useState } from 'react';
import { Check, X, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  useProviderVerifications, 
  VerificationStatus 
} from '@/hooks/admin/useProviderVerifications';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const VerificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Use our custom hook to fetch verifications
  const { 
    verifications, 
    loading, 
    error, 
    updateVerificationStatus 
  } = useProviderVerifications({ status: filter, searchTerm });

  // Calculate pagination
  const totalPages = Math.ceil(verifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVerifications = verifications.slice(startIndex, startIndex + itemsPerPage);

  const handleQuickApprove = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'approved');
    
    if (success) {
      toast({
        title: 'Verification Approved',
        description: `${name}'s verification request has been approved successfully.`,
      });
    }
  };

  const handleQuickReject = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'rejected');
    
    if (success) {
      toast({
        title: 'Verification Rejected',
        description: `${name}'s verification request has been rejected.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Provider Verifications">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-sm text-gray-500 mb-6">
            <p>Review and manage provider verification requests. Approve or reject applications after reviewing their credentials and identification documents.</p>
          </div>
          <Separator className="mb-6" />
          
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
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-klikjasa-purple animate-spin" />
              <p className="ml-2 text-gray-500">Loading verification requests...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVerifications.length > 0 ? (
                      paginatedVerifications.map((verification) => (
                        <TableRow key={verification.id}>
                          <TableCell>{verification.full_name}</TableCell>
                          <TableCell>{verification.whatsapp_number}</TableCell>
                          <TableCell>{new Date(verification.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(verification.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate(`/admin/verifications/${verification.id}`)}
                                className="h-8"
                              >
                                <Eye size={16} className="mr-1" /> View
                              </Button>
                              
                              {verification.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                                    onClick={() => handleQuickApprove(verification.id, verification.full_name)}
                                  >
                                    <Check size={16} className="mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                    onClick={() => handleQuickReject(verification.id, verification.full_name)}
                                  >
                                    <X size={16} className="mr-1" /> Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No verification requests found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default VerificationsPage;
