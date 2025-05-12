
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProviderVerificationPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: profile?.name || '',
    whatsappNumber: '',
    province: '',
    city: '',
    district: '',
    village: '',
    address: '',
    idCard: null as File | null
  });

  // Check if user is authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, idCard: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.idCard) {
        toast({
          title: 'Error',
          description: 'Please upload your ID card',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // 1. Upload ID card to Supabase Storage
      const fileExt = formData.idCard.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `id_cards/${fileName}`;
      
      // Manual progress monitoring with XHR
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', formData.idCard);
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress(percent);
        }
      });
      
      // Proceed with standard upload (without progress callback)
      const { error: uploadError, data } = await supabase.storage
        .from('verifications')
        .upload(filePath, formData.idCard, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading ID card:', uploadError);
        throw new Error('Failed to upload ID card');
      }
      
      // Get public URL
      const { data: publicURLData } = supabase
        .storage
        .from('verifications')
        .getPublicUrl(filePath);
      
      // 2. Submit verification request
      const { error: submitError } = await supabase
        .from('provider_verifications')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          whatsapp_number: formData.whatsappNumber,
          address: {
            province: formData.province,
            city: formData.city,
            district: formData.district,
            village: formData.village,
            full_address: formData.address
          },
          id_card_url: publicURLData.publicUrl
        });

      if (submitError) {
        console.error('Error submitting verification:', submitError);
        throw new Error('Failed to submit verification request');
      }

      toast({
        title: 'Success',
        description: 'Verification request submitted successfully. Please wait for admin approval.'
      });
      
      navigate('/profile');
      
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit verification request',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white p-5 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-semibold">Provider Verification</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Complete Your Verification</h2>
          <p className="text-gray-600 mb-6">
            To become a verified service provider on KlikJasa, please provide the information below. 
            Our admin team will review your application within 1-3 business days.
          </p>
          
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Input 
                  id="province" 
                  value={formData.province}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="city">City/Regency</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  value={formData.district}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="village">Village/Urban Community</Label>
                <Input 
                  id="village" 
                  value={formData.village}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea 
                id="address" 
                value={formData.address}
                onChange={handleInputChange}
                rows={3} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="idCard">ID Card (KTP)</Label>
              <div className="mt-1 flex items-center">
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-klikjasa-purple transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.idCard ? formData.idCard.name : 'Upload a photo of your ID card (KTP)'}
                    </div>
                  </div>
                  <input
                    id="idCard"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full klikjasa-gradient"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Submitting...'}
                  </>
                ) : 'Submit Verification'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderVerificationPage;
