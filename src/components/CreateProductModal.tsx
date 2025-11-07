'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productApi, Category } from '@/lib/api';
import { toast } from 'sonner';

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProductModal({ open, onOpenChange }: CreateProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    category: '',
  });

  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const cats = await productApi.getCategories();
          setCategories(cats);
        } catch (err) {
          console.error('Failed to fetch categories:', err);
          toast.error('Failed to load categories');
        }
      };
      fetchCategories();
    }
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: '',
        brand: '',
        category: '',
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.stock || !formData.brand || !formData.category || formData.category === 'none') {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const product = await productApi.createProduct({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        brand: formData.brand,
        category: formData.category,
      });
      
      toast.success(`Product "${product.title}" created successfully!`);
      onOpenChange(false);
      // Redirect to home page since DummyJSON doesn't persist created products
      // The created product won't be accessible via /product/:id
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Create product error:', err);
      let errorMessage = 'Failed to create product';
      
      if (err?.response) {
        // Axios error with response
        errorMessage = err.response.data?.message || `Request failed with status code ${err.response.status}`;
        console.error('Error details:', err.response.data);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value === 'none' ? '' : value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-title">Title *</Label>
            <Input
              id="modal-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-description">Description *</Label>
            <Textarea
              id="modal-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modal-price">Price *</Label>
              <Input
                id="modal-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-stock">Stock *</Label>
              <Input
                id="modal-stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-brand">Brand *</Label>
            <Input
              id="modal-brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Product brand"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-category">Category *</Label>
            <Select
              value={formData.category || 'none'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="modal-category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>Select a category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

