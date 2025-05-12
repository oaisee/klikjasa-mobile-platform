
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockServices, serviceCategories, locations } from '@/data/mockServices';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || service.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => handleServiceClick(service.id)}
    >
      <div className="w-1/3 h-auto overflow-hidden">
        <img 
          src={service.imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-2/3 p-3">
        <h3 className="font-medium text-base text-gray-800 line-clamp-1">{service.title}</h3>
        <div className="flex items-center mt-1 text-xs">
          <MapPin size={12} className="text-gray-500" />
          <span className="ml-1 text-gray-600">{service.location}</span>
          <span className="ml-2 text-gray-400">•</span>
          <span className="ml-2 text-gray-600">{service.duration}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{service.description}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="font-semibold text-sm text-klikjasa-purple">{formatCurrency(service.price)}</span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-xs text-gray-600">{service.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="flex items-center mb-3">
          <h1 className="text-xl font-semibold">Find Services</h1>
        </div>
        
        {/* Search bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="What service are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-klikjasa-purple focus:ring focus:ring-klikjasa-purple focus:ring-opacity-50"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 rounded-md hover:bg-gray-100"
          >
            <Filter className="text-gray-600" size={20} />
          </Button>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Location</label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      {/* Services List */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">
            {filteredServices.length} {filteredServices.length === 1 ? 'result' : 'results'} found
          </span>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredServices.length > 0 ? (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No services found matching your criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedLocation('All Locations');
              }}
              className="mt-3"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
