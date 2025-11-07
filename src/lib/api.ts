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

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
  expiresInMins?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // Get all products with pagination and sorting
  getProducts: async (limit = 10, skip = 0, sortBy?: string, order: 'asc' | 'desc' = 'asc'): Promise<ProductsResponse> => {
    let url = `/products?limit=${limit}&skip=${skip}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    const response = await api.get(url);
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
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories');
    // Ensure we return an array of Category objects
    const data = response.data;
    if (Array.isArray(data)) {
      return data.filter((cat): cat is Category => 
        typeof cat === 'object' && 
        cat !== null && 
        'slug' in cat && 
        'name' in cat && 
        'url' in cat
      );
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
    try {
      // Use full URL to ensure correct endpoint
      const url = `${API_BASE_URL}/products/add`;
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      // Log detailed error for debugging
      console.error('Create product error:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url || `${error.config?.baseURL}${error.config?.url}`,
        });
      }
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<Product> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials, {
      withCredentials: true, // Include cookies
    });
    return response.data;
  },
  
  // Refresh token
  refreshToken: async (refreshToken?: string, expiresInMins: number = 30): Promise<RefreshTokenResponse> => {
    const url = `${API_BASE_URL}/auth/refresh`;
    const response = await axios.post(
      url,
      {
        refreshToken,
        expiresInMins,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies
      }
    );
    return response.data;
  },
};

