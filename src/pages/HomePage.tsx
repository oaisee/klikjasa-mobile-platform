
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { mockServices, serviceCategories } from '@/data/mockServices';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => handleServiceClick(service.id)}
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={service.imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-800 line-clamp-1">{service.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="font-semibold text-klikjasa-purple">{formatPrice(service.price)}</span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {service.location}
          </span>
          <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded-full">
            {service.duration}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <Logo />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="rounded-full"
          >
            <span className="sr-only">Profile</span>
            <div className="h-8 w-8 rounded-full bg-klikjasa-cream flex items-center justify-center">
              <span className="text-klikjasa-deepPurple font-medium">U</span>
            </div>
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Find services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-klikjasa-purple focus:ring focus:ring-klikjasa-purple focus:ring-opacity-50"
          />
        </div>
        
        {/* Categories */}
        <div className="mt-4 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? 'bg-klikjasa-purple text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No services found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
