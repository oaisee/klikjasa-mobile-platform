
import React from 'react';
import TabBar from './TabBar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20"> {/* Add padding to bottom to account for tab bar */}
        {children}
      </div>
      {!isAuthPage && <TabBar />}
    </div>
  );
};

export default Layout;
