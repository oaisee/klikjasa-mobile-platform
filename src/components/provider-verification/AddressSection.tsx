
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useRegionSelection, Region } from '@/utils/regionApi';

interface AddressSectionProps {
  formData: {
    province: string;
    city: string;
    district: string;
    village: string;
    address: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | {
    target: { id: string; value: string }
  }) => void;
}

export function AddressSection({ formData, onChange }: AddressSectionProps) {
  const {
    provinces,
    cities,
    districts,
    villages,
    selectedProvinceId,
    selectedCityId,
    selectedDistrictId,
    selectedVillageId,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingVillages,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange
  } = useRegionSelection();

  // Update form data when selections change
  useEffect(() => {
    if (selectedProvince) {
      onChange({ target: { id: 'province', value: selectedProvince } });
    }
  }, [selectedProvince, onChange]);

  useEffect(() => {
    if (selectedCity) {
      onChange({ target: { id: 'city', value: selectedCity } });
    }
  }, [selectedCity, onChange]);

  useEffect(() => {
    if (selectedDistrict) {
      onChange({ target: { id: 'district', value: selectedDistrict } });
    }
  }, [selectedDistrict, onChange]);

  useEffect(() => {
    if (selectedVillage) {
      onChange({ target: { id: 'village', value: selectedVillage } });
    }
  }, [selectedVillage, onChange]);

  // Helper function for rendering region options
  const renderRegionOptions = (regions: Region[]) => {
    return regions.map((region) => (
      <SelectItem key={region.id} value={region.id}>
        {region.name}
      </SelectItem>
    ));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Province</Label>
          <Select
            value={selectedProvinceId}
            onValueChange={handleProvinceChange}
            disabled={loadingProvinces}
          >
            <SelectTrigger id="province-select" className="w-full">
              <SelectValue placeholder={loadingProvinces ? 'Loading provinces...' : 'Select province'}>
                {loadingProvinces ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : selectedProvince || 'Select province'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {renderRegionOptions(provinces)}
            </SelectContent>
          </Select>
          <Input 
            type="hidden"
            id="province" 
            value={formData.province}
            readOnly 
          />
        </div>
        <div>
          <Label htmlFor="city">City/Regency</Label>
          <Select
            value={selectedCityId}
            onValueChange={handleCityChange}
            disabled={loadingCities || !selectedProvinceId}
          >
            <SelectTrigger id="city-select" className="w-full">
              <SelectValue placeholder={loadingCities ? 'Loading cities...' : 'Select city'}>
                {loadingCities ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : selectedCity || 'Select city'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {renderRegionOptions(cities)}
            </SelectContent>
          </Select>
          <Input 
            type="hidden"
            id="city" 
            value={formData.city}
            readOnly 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="district">District</Label>
          <Select
            value={selectedDistrictId}
            onValueChange={handleDistrictChange}
            disabled={loadingDistricts || !selectedCityId}
          >
            <SelectTrigger id="district-select" className="w-full">
              <SelectValue placeholder={loadingDistricts ? 'Loading districts...' : 'Select district'}>
                {loadingDistricts ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : selectedDistrict || 'Select district'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {renderRegionOptions(districts)}
            </SelectContent>
          </Select>
          <Input 
            type="hidden"
            id="district" 
            value={formData.district}
            readOnly 
          />
        </div>
        <div>
          <Label htmlFor="village">Village/Urban Community</Label>
          <Select
            value={selectedVillageId}
            onValueChange={handleVillageChange}
            disabled={loadingVillages || !selectedDistrictId}
          >
            <SelectTrigger id="village-select" className="w-full">
              <SelectValue placeholder={loadingVillages ? 'Loading villages...' : 'Select village'}>
                {loadingVillages ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : selectedVillage || 'Select village'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {renderRegionOptions(villages)}
            </SelectContent>
          </Select>
          <Input 
            type="hidden"
            id="village" 
            value={formData.village}
            readOnly 
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
          placeholder="Enter your detailed address"
        />
      </div>
    </>
  );
}
