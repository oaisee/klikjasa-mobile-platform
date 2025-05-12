
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFetchVerificationDetail } from '@/hooks/admin/useFetchVerificationDetail';
import { useVerificationActions } from '@/hooks/admin/useVerificationActions';

// Import our components
import VerificationHeader from '@/components/admin/verifications/VerificationHeader';
import VerificationPersonalInfo from '@/components/admin/verifications/VerificationPersonalInfo';
import VerificationIdCard from '@/components/admin/verifications/VerificationIdCard';
import VerificationAdminActions from '@/components/admin/verifications/VerificationAdminActions';
import VerificationChecklist from '@/components/admin/verifications/VerificationChecklist';
import DetailPageLoadingState from '@/components/admin/verifications/DetailPageLoadingState';
import DetailPageErrorState from '@/components/admin/verifications/DetailPageErrorState';

const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const { 
    verification, 
    loading, 
    error: fetchError, 
    fetchVerificationById 
  } = useFetchVerificationDetail();
  
  const { updateVerificationStatus } = useVerificationActions();
  
  // Load verification data
  useEffect(() => {
    if (!id) {
      console.error("No ID parameter provided");
      setError("Missing verification ID");
      return;
    }
    
    // Validate UUID format before making API call
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error("ID is not a valid UUID format:", id);
      setError(`Invalid verification ID format: ${id}`);
      return;
    }
    
    console.log("Starting fetch for verification with ID:", id);
    
    const fetchData = async () => {
      await fetchVerificationById(id);
    };
    
    fetchData();
  }, [id, fetchVerificationById]);

  // Combine errors from state and fetch operation
  const displayError = error || fetchError;

  return (
    <AdminLayout title="Verification Details">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/admin/verifications')} className="gap-1">
          <ArrowLeft size={16} /> Back to Verifications
        </Button>
      </div>
      
      {loading ? (
        <DetailPageLoadingState />
      ) : displayError || !verification ? (
        <DetailPageErrorState error={displayError} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <VerificationHeader verification={verification} />
                <VerificationPersonalInfo verification={verification} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <VerificationIdCard idCardUrl={verification.id_card_url} />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <VerificationAdminActions 
                  id={verification.id}
                  fullName={verification.full_name}
                  status={verification.status}
                  initialNotes={verification.admin_notes || ''}
                  onUpdateStatus={updateVerificationStatus}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <VerificationChecklist />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VerificationDetailPage;
