import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // Get all products with pagination
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/products/categories');
    // Ensure we return an array of strings
    const data = response.data;
    if (Array.isArray(data)) {
      return data.filter((cat): cat is string => typeof cat === 'string');
    }
    return [];
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Create product
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post('/products/add', data);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<Product> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

