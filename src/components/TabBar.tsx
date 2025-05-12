
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role = 'user' } = useAuth();
  
  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      roles: ['user', 'provider', 'admin']
    },
    {
      name: 'Search',
      path: '/search',
      icon: Search,
      roles: ['user', 'provider', 'admin']
    },
    {
      name: role === 'provider' ? 'My Services' : 'My Orders',
      path: role === 'provider' ? '/my-services' : '/my-orders',
      icon: Briefcase,
      roles: ['user', 'provider']
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      roles: ['user', 'provider']
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      roles: ['user', 'provider', 'admin']
    }
  ];

  // Filter tabs based on auth status and role
  const filteredTabs = isAuthenticated 
    ? tabs.filter(tab => tab.roles.includes(role))
    : tabs.filter(tab => ['Home', 'Search'].includes(tab.name));

  return (
    <div className="tab-bar">
      {filteredTabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.name}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <tab.icon size={24} className={isActive ? 'text-klikjasa-purple' : 'text-gray-500'} />
            <span className={`text-xs mt-1 ${isActive ? 'text-klikjasa-purple font-medium' : 'text-gray-500'}`}>
              {tab.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
