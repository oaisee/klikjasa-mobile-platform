
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, User, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockServices } from '@/data/mockServices';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, role } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  
  const service = mockServices.find(s => s.id === id);
  
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-semibold mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  const handleBookService = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or register to book this service',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: 'Booking Requested',
        description: 'Your service request has been sent to the provider'
      });
      navigate('/my-orders');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Image Header */}
      <div className="relative h-64 w-full">
        <img 
          src={service.imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="bg-white -mt-6 rounded-t-3xl relative px-5 pt-6 pb-20">
        <h1 className="text-2xl font-semibold text-gray-800">{service.title}</h1>
        
        {/* Provider info & rating */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-klikjasa-deepPurple flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-sm font-medium">{service.providerName}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{service.rating}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Price & Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Price</span>
            <span className="text-xl font-semibold text-klikjasa-purple">{formatCurrency(service.price)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">{service.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Duration: {service.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Available: Monday - Saturday</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Description */}
        <div>
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {service.description}
            <br /><br />
            This is a professional service provided by {service.providerName}. We guarantee quality work and customer satisfaction. Please contact us if you have any questions about this service.
          </p>
        </div>
        
        {/* Reviews (mock) */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Reviews</h2>
            <button className="text-sm text-klikjasa-purple">See all</button>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-klikjasa-cream flex items-center justify-center">
                  <span className="text-klikjasa-deepPurple font-medium">A</span>
                </div>
                <span className="ml-2 font-medium text-sm">Ahmad R.</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">4.9</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Great service! The provider was professional, on-time, and did excellent work. Would definitely recommend.
            </p>
            <span className="text-xs text-gray-400 block mt-1">2 weeks ago</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-3 flex items-center justify-between shadow-md">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: 'Authentication Required',
                description: 'Please login to chat with providers',
                variant: 'destructive'
              });
              navigate('/auth');
              return;
            }
            toast({
              title: 'Chat Feature',
              description: 'Chat functionality will be available in the next update'
            });
          }}
        >
          <MessageSquare className="h-5 w-5 mr-1" />
          Chat
        </Button>
        
        <Button 
          className="klikjasa-gradient flex-1 ml-3"
          disabled={isBooking || (role === 'provider')}
          onClick={handleBookService}
        >
          {isBooking ? 'Processing...' : 'Book Service'}
        </Button>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
