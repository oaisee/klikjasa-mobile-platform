
import { useState, useEffect } from 'react';

// Interface for region data
export interface Region {
  id: string;
  name: string;
}

// Base URL for the Indonesian regions API
const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

// Function to fetch provinces
export const fetchProvinces = async (): Promise<Region[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/provinces.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch provinces');
    }
    const data = await response.json();
    return data.map((province: any) => ({
      id: province.id,
      name: province.name
    }));
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

// Function to fetch regencies/cities by provinceId
export const fetchCities = async (provinceId: string): Promise<Region[]> => {
  if (!provinceId) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/regencies/${provinceId}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return data.map((city: any) => ({
      id: city.id,
      name: city.name
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Function to fetch districts by cityId
export const fetchDistricts = async (cityId: string): Promise<Region[]> => {
  if (!cityId) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/districts/${cityId}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data.map((district: any) => ({
      id: district.id,
      name: district.name
    }));
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

// Function to fetch villages by districtId
export const fetchVillages = async (districtId: string): Promise<Region[]> => {
  if (!districtId) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/villages/${districtId}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch villages');
    }
    const data = await response.json();
    return data.map((village: any) => ({
      id: village.id,
      name: village.name
    }));
  } catch (error) {
    console.error('Error fetching villages:', error);
    return [];
  }
};

// Custom hook for managing region selection
export const useRegionSelection = () => {
  // State for each region level
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  
  // State for selected IDs
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  
  // State for selected names (to be used in the form)
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');

  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingVillages, setLoadingVillages] = useState<boolean>(false);
  
  // Fetch provinces on component mount
  useEffect(() => {
    const getProvinces = async () => {
      setLoadingProvinces(true);
      const data = await fetchProvinces();
      setProvinces(data);
      setLoadingProvinces(false);
    };
    
    getProvinces();
  }, []);
  
  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      const getCities = async () => {
        setLoadingCities(true);
        setCities([]);
        setSelectedCityId('');
        setSelectedCity('');
        setDistricts([]);
        setSelectedDistrictId('');
        setSelectedDistrict('');
        setVillages([]);
        setSelectedVillageId('');
        setSelectedVillage('');
        
        const data = await fetchCities(selectedProvinceId);
        setCities(data);
        setLoadingCities(false);
      };
      
      getCities();
    }
  }, [selectedProvinceId]);
  
  // Fetch districts when city changes
  useEffect(() => {
    if (selectedCityId) {
      const getDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setSelectedDistrictId('');
        setSelectedDistrict('');
        setVillages([]);
        setSelectedVillageId('');
        setSelectedVillage('');
        
        const data = await fetchDistricts(selectedCityId);
        setDistricts(data);
        setLoadingDistricts(false);
      };
      
      getDistricts();
    }
  }, [selectedCityId]);
  
  // Fetch villages when district changes
  useEffect(() => {
    if (selectedDistrictId) {
      const getVillages = async () => {
        setLoadingVillages(true);
        setVillages([]);
        setSelectedVillageId('');
        setSelectedVillage('');
        
        const data = await fetchVillages(selectedDistrictId);
        setVillages(data);
        setLoadingVillages(false);
      };
      
      getVillages();
    }
  }, [selectedDistrictId]);
  
  // Handle province selection
  const handleProvinceChange = (provinceId: string) => {
    const province = provinces.find(p => p.id === provinceId);
    setSelectedProvinceId(provinceId);
    setSelectedProvince(province?.name || '');
  };
  
  // Handle city selection
  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    setSelectedCityId(cityId);
    setSelectedCity(city?.name || '');
  };
  
  // Handle district selection
  const handleDistrictChange = (districtId: string) => {
    const district = districts.find(d => d.id === districtId);
    setSelectedDistrictId(districtId);
    setSelectedDistrict(district?.name || '');
  };
  
  // Handle village selection
  const handleVillageChange = (villageId: string) => {
    const village = villages.find(v => v.id === villageId);
    setSelectedVillageId(villageId);
    setSelectedVillage(village?.name || '');
  };
  
  return {
    // Lists of regions
    provinces,
    cities,
    districts,
    villages,
    
    // Selected IDs
    selectedProvinceId,
    selectedCityId,
    selectedDistrictId,
    selectedVillageId,
    
    // Selected names (for form data)
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    
    // Loading states
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingVillages,
    
    // Handlers
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange
  };
};
