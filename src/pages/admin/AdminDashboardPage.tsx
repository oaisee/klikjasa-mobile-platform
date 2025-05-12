
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, CreditCard, BarChart2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';

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
      icon: Activity, 
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
      icon: BarChart2, 
      color: 'text-yellow-500 bg-yellow-100' 
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
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
            <h3 className="text-lg font-medium mb-4">Recent Verifications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium">Provider</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="border-b last:border-0">
                      <td className="py-3">Provider {item}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">23 May 2025</td>
                      <td className="py-3">
                        <button 
                          onClick={() => navigate(`/admin/verifications/${item}`)}
                          className="text-klikjasa-purple hover:underline"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => navigate('/admin/verifications')}
                className="w-full text-center text-klikjasa-purple hover:underline mt-4 text-sm"
              >
                View All Verifications
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="border-b last:border-0">
                      <td className="py-3">#TRX-{item.toString().padStart(5, '0')}</td>
                      <td className="py-3">Rp {(item * 50000).toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item % 2 === 0 ? 'Service Fee' : 'Top Up'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">23 May 2025</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => navigate('/admin/transactions')}
                className="w-full text-center text-klikjasa-purple hover:underline mt-4 text-sm"
              >
                View All Transactions
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
