import baseUrl from "../app/baseUrl";
import axios from 'axios';

const INVENTORY_API = baseUrl.INVENTORY;

/**
 * Smart function that checks which auth method to use
 * - If token exists in localStorage → use Bearer token (Clinic/Doctor)
 * - If no token → use cookies (Normal User)
 */
const getAuthConfig = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;

  if (token) {
    // ✅ Clinic or Doctor - use Bearer token
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  } else {
    // ✅ Normal User - use cookies
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
  }
};

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string[];
    brand?: {
      name: string;
    };
  };
  variant: {
    variantId: string | null;
    size: string | null;
    color: string | null;
    material: string | null;
    price: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  clinic?: string;
  user?: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  // ✅ Add item to cart (UPDATED - simplified payload)
  addToCart: async (payload: {
    productId: string;
    variantId?: string | null;
    quantity?: number;
  }) => {
    try {
      const response = await axios.post(
        `${INVENTORY_API}/api/v1/cart/add`,
        payload,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get cart
  getCart: async () => {
    try {
      const response = await axios.get(
        `${INVENTORY_API}/api/v1/cart/get`,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (itemId: string, quantity: number) => {
    try {
      const response = await axios.put(
        `${INVENTORY_API}/api/v1/cart/item/${itemId}`,
        { quantity },
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Remove item from cart
  removeCartItem: async (itemId: string) => {
    try {
      const response = await axios.delete(
        `${INVENTORY_API}/api/v1/cart/item/${itemId}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axios.delete(
        `${INVENTORY_API}/api/v1/cart/clear`,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Checkout cart
  checkoutCart: async (payload: {
    shippingAddress: any;
    paymentMethod: string;
    orderNotes?: string;
  }) => {
    try {
      const response = await axios.post(
        `${INVENTORY_API}/api/v1/cart/checkout`,
        payload,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};