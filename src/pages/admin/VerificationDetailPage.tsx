
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Phone, MapPin, Clock, User } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mock data - would be fetched from the API based on the ID
  const verification = {
    id: Number(id),
    providerName: 'Ahmad Supri',
    email: 'ahmad.supri@example.com',
    phoneNumber: '0812-3456-7890',
    address: 'Jl. Gatot Subroto No. 123, Jakarta Selatan',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Setiabudi',
    postalCode: '12930',
    identityNumber: '3171234567890001',
    submittedDate: '2025-05-01T14:30:00',
    status: 'pending',
    idCardUrl: 'https://via.placeholder.com/800x500?text=KTP+Image'
  };

  const handleApprove = async () => {
    setLoading(true);
    
    // In a real application, this would be an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Verification Approved',
        description: `${verification.providerName}'s account has been approved successfully.`,
      });
      
      navigate('/admin/verifications');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Verification Rejected',
        description: `${verification.providerName}'s verification request has been rejected.`,
      });
      
      navigate('/admin/verifications');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
    <AdminLayout title="Verification Details">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/admin/verifications')}>
          <ArrowLeft size={16} className="mr-1" /> Back to Verifications
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{verification.providerName}</h2>
                  <p className="text-gray-500">{verification.email}</p>
                </div>
                {getStatusBadge(verification.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p>{verification.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p>{verification.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                      <p>{new Date(verification.submittedDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User size={18} className="mr-2 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Identity Number</p>
                      <p>{verification.identityNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Location Details</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Province</p>
                        <p className="text-sm">{verification.province}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">City</p>
                        <p className="text-sm">{verification.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">District</p>
                        <p className="text-sm">{verification.district}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Postal Code</p>
                        <p className="text-sm">{verification.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-4">Identity Card Image</h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={verification.idCardUrl} 
                    alt="Identity Card" 
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Actions</h3>
              
              {verification.status === 'pending' ? (
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={loading}
                  >
                    <Check size={16} className="mr-1" /> Approve Verification
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleReject}
                    disabled={loading}
                  >
                    <X size={16} className="mr-1" /> Reject Verification
                  </Button>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  This verification has already been {verification.status}.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VerificationDetailPage;
