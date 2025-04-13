import axios from 'axios';
import { API_ENDPOINTS } from '../constants'; // Adjust the import path

const visitorsService = {

  getAllPreApprovals: async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pre-approval:', error);
      throw error; // Re-throw for component handling
    }
  },

  getPaginatedPreApprovals: async (page: number, limit: number) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/paginated`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pre-approvals:', error);
      throw error; // Re-throw the error for component handling
    }
  },

  getPaginatedPreApprovalsStatusUpcoming: async (page: number, limit: number) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/paginated/upcoming`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pre-approvals:', error);
      throw error; // Re-throw the error for component handling
    }
  },

  getPaginatedPreApprovalsStatusExpired: async (page: number, limit: number) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/paginated/expired`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pre-approvals:', error);
      throw error; // Re-throw the error for component handling
    }
  },

  createPreApproval: async (values: any) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals`, values);
      return response.data;
    } catch (error: any) {
      console.error('Error creating pre-approval:', error);
      throw error; // Re-throw for component handling
    }
  },

  getPreApprovalById: async (id: string) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pre-approval:', error);
      throw error; // Re-throw for component handling
    }
  },

  updatePreApproval: async (id: string, values: any) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/${id}`, values);
      return response.data;
    } catch (error: any) {
      console.error('Error updating pre-approval:', error);
      throw error; // Re-throw for component handling
    }
  },

  deletePreApproval: async (id: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/${id}`);
    } catch (error: any) {
      console.error('Error deleting pre-approval:', error);
      throw error; // Re-throw the error for component handling
    }
  },
};

export default visitorsService;