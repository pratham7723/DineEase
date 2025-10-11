import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image, 
  Box, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Utensils,
  ChevronDown,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

// Helper function to format INR
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredMenuItems, setFilteredMenuItems] = useState([]); // State for filtered items
  const [availableCategories, setAvailableCategories] = useState([]); // State for available categories
  const [categoryOpen, setCategoryOpen] = useState(false); // State for category combobox

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available",
    photo: "",
    arModel: "",
  });

  // Function to extract unique categories from menu items
  const extractCategories = (items) => {
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return categories.sort();
  };

  // Fetch menu data from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`
        );
        setMenuItems(response.data);
        setFilteredMenuItems(response.data); // Initialize filtered items with all items
        setAvailableCategories(extractCategories(response.data)); // Extract categories
      } catch (err) {
        setError("Failed to fetch menu items");
        console.error(err);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search on Enter key press
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission (if inside a form)
      const filtered = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  };

  // Handle adding or updating a menu item
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      let response;
      if (editingItem) {
        // Update existing item
        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus/${
            editingItem._id
          }`,
          newItem
        );
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        );
        setFilteredMenuItems(
          filteredMenuItems.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        );
        setEditingItem(null);
      } else {
        // Add new item
        response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`,
          newItem
        );
        setMenuItems([...menuItems, response.data]);
        setFilteredMenuItems([...filteredMenuItems, response.data]);
        // Update available categories if new category is added
        if (!availableCategories.includes(response.data.category)) {
          setAvailableCategories([...availableCategories, response.data.category].sort());
        }
      }
      // Reset the form and close dialog
      setNewItem({
        name: "",
        category: "",
        price: "",
        status: "Available",
        photo: "",
        arModel: "",
      });
      setEditingItem(null);
      setIsDialogOpen(false);
      toast.success(editingItem ? "Menu item updated successfully!" : "Menu item added successfully!");
      console.log("Menu item saved:", response.data);
    } catch (error) {
      toast.error("Failed to save menu item");
      console.error(error);
    }
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price,
      status: item.status,
      photo: item.photo,
      arModel: item.arModel,
    });
    setIsDialogOpen(true);
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus/${id}`
      );
      setMenuItems(menuItems.filter((item) => item._id !== id));
      setFilteredMenuItems(
        filteredMenuItems.filter((item) => item._id !== id)
      );
      toast.success("Menu item deleted successfully!");
      console.log("Menu item deleted:", id);
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error(error);
    }
  };

  // ImageKit authentication
  const authenticator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/images/auth`
      );
      const { expire, signature, token } = response.data.data;
      return { expire, signature, token };
    } catch (error) {
      console.error("Error authenticating with ImageKit:", error);
    }
  };

  // Handle image upload success
  const handleUploadSuccess = (response) => {
    setUploading(false);
    console.log("Upload success:", response);
    setNewItem((prev) => ({ ...prev, photo: response.url }));
  };

  // Handle AR model upload success
  const handleARUploadSuccess = (response) => {
    console.log("AR Model Upload successful:", response);
    setNewItem((prev) => ({ ...prev, arModel: response.url }));
  };

  // Handle upload error
  const handleUploadError = (error) => {
    setUploading(false);
    console.error("Upload failed:", error);
    toast.error("Upload failed. Please try again.");
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Menu Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your restaurant menu items, prices, and AR models
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              className="pl-10 w-64"
            />
          </div>
          <Button
            onClick={() => {
              const filtered = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setFilteredMenuItems(filtered);
            }}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Add New Item Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingItem(null);
            setNewItem({
              name: "",
              category: "",
              price: "",
              status: "Available",
              photo: "",
              arModel: "",
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              addMenuItem();
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between"
                      >
                        {newItem.category || "Select or create category"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search or create category..." 
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({...newItem, category: value})}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="p-2">
                              <p className="text-sm text-muted-foreground mb-2">
                                No category found. Create new category:
                              </p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (newItem.category.trim()) {
                                    setNewItem({...newItem, category: newItem.category.trim()});
                                    setCategoryOpen(false);
                                  }
                                }}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create "{newItem.category}"
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {availableCategories.map((category) => (
                              <CommandItem
                                key={category}
                                value={category}
                                onSelect={() => {
                                  setNewItem({...newItem, category});
                                  setCategoryOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    newItem.category === category ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {category}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="text-xs text-muted-foreground">
                    Type to search existing categories or create a new one
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={newItem.status}
                    onValueChange={(value) => setNewItem({...newItem, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Image</Label>
                  <div className="flex flex-col items-center space-y-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    <IKContext
                      publicKey={import.meta.env.VITE_REACT_APP_IMAGEKIT_PUBLIC_KEY}
                      urlEndpoint={import.meta.env.VITE_REACT_APP_IMAGEKIT_URL_ENDPOINT}
                      authenticator={authenticator}
                    >
                      <IKUpload
                        className="hidden"
                        onSuccess={handleUploadSuccess}
                        onError={handleUploadError}
                        multiple={false}
                        type="image/*"
                        id="image-file-upload"
                        folder="qrcode/menu_images"
                        onUploadStart={() => setUploading(true)}
                        disabled={isUploading}
                      />
                    </IKContext>
                    {newItem.photo && (
                      <div className="mt-2">
                        <img src={newItem.photo} alt="Preview" className="w-16 h-16 object-cover rounded" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>AR Model</Label>
                  <div className="flex flex-col items-center space-y-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <Box className="h-8 w-8 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload AR Model"}
                    </Button>
                    <IKContext>
                      <IKUpload
                        className="hidden"
                        onSuccess={handleARUploadSuccess}
                        onError={handleUploadError}
                        multiple={false}
                        id="ar-file-upload"
                        folder="qrcode/ar_models"
                        accept=".glb,.gltf"
                        onUploadStart={() => setUploading(true)}
                        disabled={isUploading}
                      />
                    </IKContext>
                    {newItem.arModel && (
                      <div className="mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-xs text-muted-foreground">AR Model uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setIsDialogOpen(false);
                    setNewItem({
                      name: "",
                      category: "",
                      price: "",
                      status: "Available",
                      photo: "",
                      arModel: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                      {editingItem ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {editingItem ? "Update Item" : "Add Item"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Menu Items ({filteredMenuItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                <span className="text-muted-foreground">Loading menu items...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredMenuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No menu items found</h3>
              <p className="text-sm text-muted-foreground text-center">
                {searchTerm ? 'No items match your search criteria' : 'Get started by adding your first menu item'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AR Model</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenuItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="font-medium">
                        {formatINR(Number(item.price))}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === "Available" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.arModel ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Not available</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEditItem(item)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(item._id)}
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Menu;