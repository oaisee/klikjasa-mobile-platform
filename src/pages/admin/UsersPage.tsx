
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, UserCheck, UserX, Shield } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  is_verified: boolean;
  balance: number;
  created_at: string;
  phone_number?: string;
}

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'user' | 'provider' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply role filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('role', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by search term if provided
      let filteredUsers = data || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name?.toLowerCase().includes(term) || 
          user.email?.toLowerCase().includes(term) ||
          user.phone_number?.includes(term)
        );
      }
      
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [filter]); // Fetch when filter changes
  
  // For search, use a debounce approach
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 300);
    
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'provider' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole} successfully.`
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(balance);
  };
  
  const getUserStatusBadge = (user: User) => {
    if (user.role === 'admin') {
      return <Badge className="bg-purple-600">Admin</Badge>;
    }
    if (user.role === 'provider') {
      return user.is_verified ? 
        <Badge className="bg-green-600">Verified Provider</Badge> : 
        <Badge variant="outline" className="text-amber-600 border-amber-600">Unverified Provider</Badge>;
    }
    return <Badge variant="outline" className="text-blue-600 border-blue-600">User</Badge>;
  };

  return (
    <AdminLayout title="User Management">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-sm text-gray-500 mb-6">
            <p>Manage user accounts, update roles, and view user information across the platform.</p>
          </div>
          <Separator className="mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
                size="sm"
              >
                All Users
              </Button>
              <Button 
                variant={filter === 'user' ? 'default' : 'outline'} 
                onClick={() => setFilter('user')}
                className={filter === 'user' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
                size="sm"
              >
                Customers
              </Button>
              <Button 
                variant={filter === 'provider' ? 'default' : 'outline'} 
                onClick={() => setFilter('provider')}
                className={filter === 'provider' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
                size="sm"
              >
                Providers
              </Button>
              <Button 
                variant={filter === 'admin' ? 'default' : 'outline'} 
                onClick={() => setFilter('admin')}
                className={filter === 'admin' ? 'bg-klikjasa-purple hover:bg-klikjasa-deepPurple' : ''}
                size="sm"
              >
                Admins
              </Button>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="w-full md:w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchUsers}
                title="Refresh users list"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-klikjasa-purple animate-spin" />
              <p className="ml-2 text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchUsers}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getUserStatusBadge(user)}</TableCell>
                          <TableCell>{formatBalance(user.balance)}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              {user.email !== 'admin@klikjasa.com' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleUpdateRole(user.id, 'user')}
                                    disabled={user.role === 'user'}
                                  >
                                    <UserCheck size={16} className="mr-1" /> User
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleUpdateRole(user.id, 'provider')}
                                    disabled={user.role === 'provider'}
                                  >
                                    <UserX size={16} className="mr-1" /> Provider
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                    onClick={() => handleUpdateRole(user.id, 'admin')}
                                    disabled={user.role === 'admin'}
                                  >
                                    <Shield size={16} className="mr-1" /> Admin
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No users found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-4 py-2">
                        Page {currentPage} of {totalPages || 1}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersPage;
