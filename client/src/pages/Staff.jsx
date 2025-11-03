import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding new staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Waiter',
    phone: '',
    status: 'Active',
  });

  // State for editing staff
  const [editStaff, setEditStaff] = useState({
    _id: '',
    name: '',
    email: '',
    role: '',
    phone: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch staff data from the backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users`, {
          headers: {
            'Content-Type': 'application/json',
            // Add if using auth:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch staff');
        }
  
        if (!Array.isArray(data)) {
          throw new Error('Received invalid staff data format');
        }
  
        setStaff(data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message || 'Failed to fetch staff');
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Handle input change for forms
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'new') {
      setNewStaff({ ...newStaff, [name]: value });
    } else {
      setEditStaff({ ...editStaff, [name]: value });
    }
  };

  // Add new staff
  const addStaff = async () => {
    // Validate required fields
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error('Name, email, and password are required');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add staff');
      }
  
      setStaff([...staff, data]);
      setNewStaff({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'Waiter', 
        phone: '' 
      });
      toast.success('Staff member added successfully');
      setError(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to add staff member');
      setError(error.message);
    }
  };

  // Update staff
  const updateStaff = async () => {
    try {
      // Prepare update data (only include changed fields)
      const updateData = {
        role: editStaff.role,
        ...(editStaff.password && { password: editStaff.password })
      };

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/${editStaff._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update staff');

      setStaff(staff.map((s) => (s._id === editStaff._id ? { ...s, ...updateData } : s)));
      setIsEditing(false);
      toast.success('Staff member updated successfully');
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.message || 'Failed to update staff member');
      setError(error.message);
    }
  };

  // Delete staff member
  const deleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete staff');

      setStaff(staff.filter((s) => s._id !== id));
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete staff member');
      setError(error.message);
    }
  };

  // Open edit modal with staff data
  const openEditModal = (staffMember) => {
    setEditStaff({
      _id: staffMember._id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      phone: staffMember.phone,
      password: ''
    });
    setIsEditing(true);
  };

  return (
    <AppLayout>
      <div className="flex-1 p-8 min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-[#123499]" />
            <h2 className="text-3xl font-bold text-gray-800">Staff Management</h2>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Add Staff Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  name="name" 
                  placeholder="Full Name" 
                  value={newStaff.name} 
                  onChange={(e) => handleInputChange(e, 'new')} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email" 
                  type="email"
                  placeholder="Email Address" 
                  value={newStaff.email} 
                  onChange={(e) => handleInputChange(e, 'new')} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  name="password" 
                  type="password"
                  placeholder="Password" 
                  value={newStaff.password} 
                  onChange={(e) => handleInputChange(e, 'new')} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  name="role" 
                  value={newStaff.role} 
                  onValueChange={(value) => setNewStaff({...newStaff, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  name="phone" 
                  placeholder="Phone Number" 
                  value={newStaff.phone} 
                  onChange={(e) => handleInputChange(e, 'new')} 
                />
              </div>
            </div>
            <Button 
              onClick={addStaff} 
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Details
              </CardTitle>
              <Badge variant="secondary">
                {staff.length} staff member{staff.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#123499]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.length > 0 ? (
                      staff.map((s) => (
                        <TableRow key={s._id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>
                            <Badge variant={
                              s.role === 'Manager' ? 'default' :
                              s.role === 'Chef' ? 'secondary' :
                              s.role === 'Owner' ? 'destructive' :
                              'outline'
                            }>
                              {s.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell>{s.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>
                              {s.status || 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditModal(s)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteStaff(s._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          No staff members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Staff Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name"
                  value={editStaff.name} 
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email"
                  value={editStaff.email} 
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editStaff.role} 
                  onValueChange={(value) => setEditStaff({...editStaff, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password (Optional)</Label>
                <Input 
                  id="edit-password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={editStaff.password} 
                  onChange={(e) => handleInputChange(e, 'edit')} 
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={updateStaff}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Staff;