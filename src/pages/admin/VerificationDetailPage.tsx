
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Phone, MapPin, Clock, User, FileText, Calendar, Mail } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  useProviderVerifications,
  ProviderVerification
} from '@/hooks/admin/useProviderVerifications';
import { Loader2 } from 'lucide-react';

const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ensure we're handling it as a string
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [verification, setVerification] = useState<ProviderVerification | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchVerificationById, updateVerificationStatus } = useProviderVerifications();
  
  // Checklist state
  const [checklist, setChecklist] = useState({
    idMatch: false,
    photoClear: false,
    idValid: false,
    addressComplete: false
  });

  // Load verification data
  useEffect(() => {
    const loadVerification = async () => {
      // If there's no ID or ID is ":id" (route parameter placeholder), navigate back
      if (!id || id === ":id") {
        console.log("Invalid ID parameter:", id);
        setError("Invalid verification ID");
        setDataLoading(false);
        return;
      }
      
      // Validate UUID format before making API call
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.log("ID is not a valid UUID format:", id);
        setError(`Invalid verification ID format: ${id}`);
        setDataLoading(false);
        return;
      }
      
      try {
        console.log("Fetching verification with ID:", id);
        setDataLoading(true);
        const data = await fetchVerificationById(id);
        
        if (data) {
          console.log("Verification data loaded successfully:", data);
          setVerification(data);
          if (data.admin_notes) {
            setAdminNotes(data.admin_notes);
          }
        } else {
          console.log("No verification data returned for ID:", id);
          setError("Verification request not found");
        }
      } catch (err) {
        console.error("Error loading verification:", err);
        setError("Failed to load verification details");
      } finally {
        setDataLoading(false);
      }
    };
    
    loadVerification();
  }, [id, fetchVerificationById]);

  const handleApprove = async () => {
    if (!verification || !id) return;
    
    setLoading('approving');
    
    try {
      const success = await updateVerificationStatus(id, 'approved', adminNotes);
      
      if (success) {
        toast({
          title: 'Verification Approved',
          description: `${verification.full_name}'s account has been approved successfully.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    if (!verification || !id) return;
    
    setLoading('rejecting');
    
    try {
      const success = await updateVerificationStatus(id, 'rejected', adminNotes);
      
      if (success) {
        toast({
          title: 'Verification Rejected',
          description: `${verification.full_name}'s verification request has been rejected.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
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

  // Show loading state
  if (dataLoading) {
    return (
      <AdminLayout title="Verification Details">
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 text-klikjasa-purple animate-spin" />
          <p className="mt-4 text-gray-600">Loading verification details...</p>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error || !verification) {
    return (
      <AdminLayout title="Verification Details">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
          <p className="text-red-600 mb-4">{error || "Verification not found"}</p>
          <Button variant="outline" onClick={() => navigate('/admin/verifications')}>
            Back to Verifications
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Verification Details">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/admin/verifications')} className="gap-1">
          <ArrowLeft size={16} /> Back to Verifications
        </Button>
      </div>
      
      {dataLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 text-klikjasa-purple animate-spin" />
          <p className="mt-4 text-gray-600">Loading verification details...</p>
        </div>
      ) : error || !verification ? (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
          <p className="text-red-600 mb-4">{error || "Verification not found"}</p>
          <Button variant="outline" onClick={() => navigate('/admin/verifications')}>
            Back to Verifications
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{verification.full_name}</h2>
                    <p className="text-gray-500">{(verification as any).profiles?.email || "No email available"}</p>
                  </div>
                  {getStatusBadge(verification.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone size={18} className="mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">WhatsApp Number</p>
                        <p>{verification.whatsapp_number}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail size={18} className="mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{(verification as any).profiles?.email || "No email available"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock size={18} className="mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                        <p>{new Date(verification.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <MapPin size={18} className="mr-3 mt-1 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p>{verification.address?.full_address || "Address not provided"}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Province</p>
                            <p className="text-sm">{verification.address?.province || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">City</p>
                            <p className="text-sm">{verification.address?.city || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">District</p>
                            <p className="text-sm">{verification.address?.district || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Village</p>
                            <p className="text-sm">{verification.address?.village || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" /> 
                  Identity Card Image
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={verification.id_card_url} 
                    alt="Identity Card" 
                    className="w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Verify that the ID card photo is clear and matches the information provided.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Admin Notes</h3>
                <Textarea 
                  placeholder="Add notes about this verification (optional)"
                  className="resize-none mb-4"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
                
                {verification.status === 'pending' ? (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={loading !== null}
                    >
                      <Check size={18} className="mr-2" /> 
                      {loading === 'approving' ? 'Processing...' : 'Approve Verification'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleReject}
                      disabled={loading !== null}
                    >
                      <X size={18} className="mr-2" /> 
                      {loading === 'rejecting' ? 'Processing...' : 'Reject Verification'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500 mb-1">
                      This verification has already been {verification.status}.
                    </p>
                    <p className="text-sm text-gray-400">
                      No further actions can be taken
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Verification Checklist</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="check-id" 
                      className="mt-1 mr-3"
                      checked={checklist.idMatch}
                      onChange={(e) => setChecklist({...checklist, idMatch: e.target.checked})}
                    />
                    <label htmlFor="check-id" className="text-sm">
                      ID Card matches the provided personal information
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="check-photo" 
                      className="mt-1 mr-3"
                      checked={checklist.photoClear}
                      onChange={(e) => setChecklist({...checklist, photoClear: e.target.checked})}
                    />
                    <label htmlFor="check-photo" className="text-sm">
                      Photo on ID is clear and identifiable
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="check-valid" 
                      className="mt-1 mr-3"
                      checked={checklist.idValid}
                      onChange={(e) => setChecklist({...checklist, idValid: e.target.checked})}
                    />
                    <label htmlFor="check-valid" className="text-sm">
                      ID Card is valid and not expired
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="check-address" 
                      className="mt-1 mr-3"
                      checked={checklist.addressComplete}
                      onChange={(e) => setChecklist({...checklist, addressComplete: e.target.checked})}
                    />
                    <label htmlFor="check-address" className="text-sm">
                      Address information is complete and valid
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VerificationDetailPage;
