import baseUrl from "../app/baseUrl";
import axios from 'axios';

const INVENTORY_API = baseUrl.INVENTORY;

const getAuthConfig = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;

  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  } else {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
  }
};

export interface InitiatePaymentParams {
  amount: number;
  firstname: string;
  email: string;
  phone: string;
  productinfo: string;
  orderId: string;
  orderNumber: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  paymentType: string;
}

export const paymentService = {
  // Initiate payment
  initiatePayment: async (params: InitiatePaymentParams) => {
    try {
      const response = await axios.post(
        `${INVENTORY_API}/api/v1/payment/initiate`,
        params,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentData: any) => {
    try {
      const response = await axios.post(
        `${INVENTORY_API}/api/v1/payment/verify`,
        paymentData,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};