
import { AddressDetails } from '../types/verification';

/**
 * Parses address data from different formats into a standardized AddressDetails object
 */
export function parseAddressData(addressInput: any): AddressDetails {
  if (!addressInput) {
    return {
      province: "No data",
      city: "No data",
      district: "No data",
      village: "No data", 
      full_address: "Address data not available"
    };
  }
  
  try {
    // Handle string format (JSON string)
    if (typeof addressInput === 'string') {
      try {
        return JSON.parse(addressInput) as AddressDetails;
      } catch (parseError) {
        console.error("Error parsing address JSON string:", parseError);
        return createErrorAddress("Error parsing");
      }
    }
    
    // Handle direct object format - validate it has required fields
    if (typeof addressInput === 'object') {
      // Check if it has the required fields
      const requiredFields = ['province', 'city', 'district', 'village', 'full_address'];
      const hasAllFields = requiredFields.every(field => 
        Object.prototype.hasOwnProperty.call(addressInput, field)
      );
      
      if (hasAllFields) {
        return addressInput as AddressDetails;
      }
      
      // Try to construct a valid object from available fields
      return {
        province: addressInput.province || "Missing data",
        city: addressInput.city || "Missing data",
        district: addressInput.district || "Missing data",
        village: addressInput.village || "Missing data",
        full_address: addressInput.full_address || "Incomplete address data"
      };
    }
    
    // Handle array or other unexpected types
    console.error("Unexpected address format:", typeof addressInput);
    return createErrorAddress("Unexpected format");
    
  } catch (error) {
    console.error("Error processing address data:", error);
    return createErrorAddress("Error processing");
  }
}

function createErrorAddress(errorPrefix: string): AddressDetails {
  return {
    province: `${errorPrefix} province`,
    city: `${errorPrefix} city`,
    district: `${errorPrefix} district`,
    village: `${errorPrefix} village`,
    full_address: `${errorPrefix} address data`
  };
}
