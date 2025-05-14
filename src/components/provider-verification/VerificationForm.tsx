import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadIdCard } from '@/components/provider-verification/utils/uploadUtils';
import { submitVerificationRequest } from '@/components/provider-verification/utils/verificationApi';
import { AddressSection } from '@/components/provider-verification/AddressSection';
import { IdCardUploader } from '@/components/provider-verification/IdCardUploader';

interface VerificationFormData {
  fullName: string;
  whatsappNumber: string;
  province: string;
  city: string;
  district: string;
  village: string;
  address: string;
  idCard: File | null;
}

export function VerificationForm() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<VerificationFormData>({
    fullName: profile?.name || '',
    whatsappNumber: '',
    province: '',
    city: '',
    district: '',
    village: '',
    address: '',
    idCard: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user makes changes after an error
    if (uploadError) setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, idCard: e.target.files![0] }));
      // Clear error when user selects a new file after an error
      if (uploadError) setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      if (!formData.idCard) {
        toast("Error", {
          description: "Please upload your ID card",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast("Authentication Error", {
          description: "You need to be logged in to submit a verification request",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // 1. Upload ID card first
      toast("Uploading", {
        description: "Uploading your ID card..."
      });
      
      const uploadResult = await uploadIdCard(user.id, formData.idCard, (progress) => {
        setUploadProgress(progress);
      });
      
      if (!uploadResult.success) {
        setUploadError(uploadResult.error || "Failed to upload ID card");
        throw new Error(uploadResult.error || "Failed to upload ID card. Please try again.");
      }
      
      // 2. Submit verification request with the uploaded ID card URL
      const submitResult = await submitVerificationRequest({
        userId: user.id,
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        address: {
          province: formData.province,
          city: formData.city,
          district: formData.district,
          village: formData.village,
          full_address: formData.address
        },
        idCardUrl: uploadResult.publicUrl || ""
      });

      if (!submitResult.success) {
        throw new Error(submitResult.error || "Failed to submit verification request");
      }

      toast("Success", {
        description: "Your verification request has been submitted successfully. Please wait for admin approval."
      });
      
      navigate("/profile");
      
    } catch (error) {
      console.error("Verification error:", error);
      toast("Error", {
        description: error instanceof Error ? error.message : "Something went wrong during the verification process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="fullName">Full Name (as on ID)</Label>
        <Input 
          id="fullName" 
          value={formData.fullName}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        <Input 
          id="whatsappNumber"
          placeholder="e.g. 628123456789" 
          value={formData.whatsappNumber}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <AddressSection 
        formData={formData}
        onChange={handleInputChange}
      />
      
      <IdCardUploader 
        onFileChange={handleFileChange}
        selectedFile={formData.idCard}
        error={uploadError}
      />
      
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <p><strong>Upload Error:</strong> {uploadError}</p>
          <p className="mt-1">Please try again or contact support if the problem persists.</p>
        </div>
      )}
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full klikjasa-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : "Processing..."}
            </>
          ) : "Submit Verification"}
        </Button>
      </div>
    </form>
  );
}
