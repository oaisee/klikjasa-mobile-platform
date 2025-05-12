
import React, { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const VerificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - would be fetched from the API
  const verifications = [
    { id: 1, providerName: 'Ahmad Supri', phoneNumber: '0812-3456-7890', submittedDate: '2025-05-01', status: 'pending' },
    { id: 2, providerName: 'Budi Santoso', phoneNumber: '0813-2345-6789', submittedDate: '2025-05-02', status: 'pending' },
    { id: 3, providerName: 'Citra Dewi', phoneNumber: '0857-1234-5678', submittedDate: '2025-05-03', status: 'pending' },
    { id: 4, providerName: 'Dewi Anggraini', phoneNumber: '0878-9876-5432', submittedDate: '2025-05-04', status: 'approved' },
    { id: 5, providerName: 'Eko Prasetyo', phoneNumber: '0819-8765-4321', submittedDate: '2025-05-05', status: 'rejected' },
  ];

  const filteredVerifications = verifications
    .filter(v => filter === 'all' || v.status === filter)
    .filter(v => 
      v.providerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.phoneNumber.includes(searchTerm)
    );

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
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'} 
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
              >
                Pending
              </Button>
              <Button 
                variant={filter === 'approved' ? 'default' : 'outline'} 
                onClick={() => setFilter('approved')}
                className={filter === 'approved' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
              >
                Approved
              </Button>
              <Button 
                variant={filter === 'rejected' ? 'default' : 'outline'} 
                onClick={() => setFilter('rejected')}
                className={filter === 'rejected' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
              >
                Rejected
              </Button>
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
              >
                All
              </Button>
            </div>
            <div className="w-full sm:w-64">
              <Input 
                placeholder="Search by name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Provider Name</th>
                  <th className="pb-2 font-medium">Phone Number</th>
                  <th className="pb-2 font-medium">Submitted Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.length > 0 ? (
                  filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="border-b">
                      <td className="py-4">{verification.providerName}</td>
                      <td className="py-4">{verification.phoneNumber}</td>
                      <td className="py-4">{new Date(verification.submittedDate).toLocaleDateString()}</td>
                      <td className="py-4">{getStatusBadge(verification.status)}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/verifications/${verification.id}`)}>
                            <Eye size={16} className="mr-1" /> View
                          </Button>
                          
                          {verification.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                <Check size={16} className="mr-1" /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <X size={16} className="mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">No verification requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default VerificationsPage;
