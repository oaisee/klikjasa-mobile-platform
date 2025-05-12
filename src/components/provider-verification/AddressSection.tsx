
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddressSectionProps {
  formData: {
    province: string;
    city: string;
    district: string;
    village: string;
    address: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AddressSection({ formData, onChange }: AddressSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Province</Label>
          <Input 
            id="province" 
            value={formData.province}
            onChange={onChange}
            required 
          />
        </div>
        <div>
          <Label htmlFor="city">City/Regency</Label>
          <Input 
            id="city" 
            value={formData.city}
            onChange={onChange}
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
            onChange={onChange}
            required 
          />
        </div>
        <div>
          <Label htmlFor="village">Village/Urban Community</Label>
          <Input 
            id="village" 
            value={formData.village}
            onChange={onChange}
            required 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Full Address</Label>
        <Textarea 
          id="address" 
          value={formData.address}
          onChange={onChange}
          rows={3} 
          required 
        />
      </div>
    </>
  );
}
