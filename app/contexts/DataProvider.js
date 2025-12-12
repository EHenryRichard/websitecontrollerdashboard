'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { showError } from '@/utils/toast';
import { useAuth } from './AuthProvider';
import { useUser } from '@/contexts/userProvider';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // State for different data types
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteWithId, setSiteWithId] = useState(null); // Changed initial state to null for single site
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [isLoadingSiteWithId, setIsLoadingSiteWithId] = useState(false);
  const { userDetails } = useUser();

  // Fetch all clients
  const fetchClients = useCallback(
    async (showLoading = true) => {
      const userId = userDetails.userId || userDetails.id || userDetails._id;

      if (showLoading) setIsLoadingClients(true);

      try {
        const response = await axiosInstance.get(`/clients/user/${userId}`);
        const clientsData = response.data.data || response.data || [];
        setClients(clientsData);
        return clientsData;
      } catch (error) {
        showError(error?.response?.data?.message || 'Failed to load clients');
        return [];
      } finally {
        if (showLoading) setIsLoadingClients(false);
      }
    },
    [isAuthenticated, userDetails]
  );

  // Fetch all sites
  const fetchSites = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoadingSites(true);

      try {
        const response = await axiosInstance.get(`/sites`);
        const sitesData = response.data.data || response.data || [];
        setSites(sitesData);
        return sitesData;
      } catch (error) {
        showError(error?.response?.data?.error || 'Failed to load sites');
        return [];
      } finally {
        if (showLoading) setIsLoadingSites(false);
      }
    },
    [isAuthenticated, userDetails]
  );

  const fetchSiteWithId = useCallback(
    async (id, showLoading = true) => {
      if (showLoading) setIsLoadingSiteWithId(true);

      try {
        const response = await axiosInstance.get(`/sites/${id}`);
        const siteData = response.data.data || response.data || null; // Fallback to null if empty
        setSiteWithId(siteData); // Fixed: Set the site data to the correct state, not isLoadingSites
        return siteData;
      } catch (error) {
        showError(error?.response?.data?.error || 'Failed to load site'); // Show error toast for better UX
        throw new Error(error?.response?.data?.error || 'Failed to load site');
      } finally {
        if (showLoading) setIsLoadingSiteWithId(false);
      }
    },
    [isAuthenticated, userDetails]
  );

  const fetchUserWebSites = useCallback(async () => {}, []); // Placeholder; implement if needed

  // Auto-fetch data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userDetails) {
      fetchClients();
      fetchSites();
    } else {
      // Clear data when logged out
      setClients([]);
      setSites([]);
      setSiteWithId(null);
    }
  }, [isAuthenticated, userDetails, fetchClients, fetchSites]);

  const value = {
    // Data
    clients,
    sites,
    siteWithId, // Expose the single site state

    // Loading states
    isLoadingClients,
    isLoadingSites,
    isLoadingSiteWithId,

    // Fetch methods
    fetchClients,
    fetchSites,
    fetchSiteWithId,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
