
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, CreditCard, BarChart2, UserCheck, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // These would be fetched from the API in a real application
  const stats = [
    { 
      title: 'Total Users', 
      value: '1,248', 
      change: '+12% from last month', 
      icon: Users, 
      color: 'text-blue-500 bg-blue-100'
    },
    { 
      title: 'Active Providers', 
      value: '312', 
      change: '+5% from last month', 
      icon: UserCheck, 
      color: 'text-green-500 bg-green-100' 
    },
    { 
      title: 'Platform Revenue', 
      value: 'Rp 8,540,000', 
      change: '+18% from last month', 
      icon: CreditCard, 
      color: 'text-purple-500 bg-purple-100' 
    },
    { 
      title: 'Pending Verifications', 
      value: '24', 
      change: '-3% from last month', 
      icon: AlertTriangle, 
      color: 'text-yellow-500 bg-yellow-100' 
    }
  ];

  const recentVerifications = [
    { id: 1, provider: 'Ahmad Supri', status: 'pending', date: '2025-05-12' },
    { id: 2, provider: 'Budi Santoso', status: 'pending', date: '2025-05-11' },
    { id: 3, provider: 'Citra Dewi', status: 'approved', date: '2025-05-10' },
    { id: 4, provider: 'Dewi Anggraini', status: 'rejected', date: '2025-05-09' },
    { id: 5, provider: 'Eko Prasetyo', status: 'pending', date: '2025-05-08' },
  ];

  const recentTransactions = [
    { id: 1, amount: 50000, type: 'top_up', date: '2025-05-12' },
    { id: 2, amount: 100000, type: 'service_fee', date: '2025-05-11' },
    { id: 3, amount: 75000, type: 'top_up', date: '2025-05-10' },
    { id: 4, amount: 150000, type: 'service_fee', date: '2025-05-09' },
    { id: 5, amount: 200000, type: 'top_up', date: '2025-05-08' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'top_up':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Top Up</Badge>;
      case 'service_fee':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Service Fee</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Verifications</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/verifications')}
                className="text-klikjasa-purple hover:bg-klikjasa-cream"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVerifications.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3">{item.provider}</td>
                      <td className="py-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3 text-gray-500">{item.date}</td>
                      <td className="py-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/verifications/${item.id}`)}
                          className="text-klikjasa-purple hover:bg-klikjasa-cream h-8 px-2"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/transactions')}
                className="text-klikjasa-purple hover:bg-klikjasa-cream"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3">#TRX-{item.id.toString().padStart(5, '0')}</td>
                      <td className="py-3">Rp {item.amount.toLocaleString()}</td>
                      <td className="py-3">
                        {getTransactionTypeBadge(item.type)}
                      </td>
                      <td className="py-3 text-gray-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
