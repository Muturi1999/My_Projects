/**
 * CMS API client.
 * Functions for interacting with the CMS service.
 */
import apiClient from './client';
import type {
  Homepage,
  Navigation,
  Footer,
  ServiceGuarantee,
  ServiceGuaranteeListResponse,
} from './types';

export const cmsApi = {
  /**
   * Get current homepage
   */
  getHomepage: async (): Promise<Homepage> => {
    const response = await apiClient.get<Homepage>('/cms/queries/homepage/current/');
    return response.data;
  },

  /**
   * Get homepage by ID
   */
  getHomepageById: async (id: string): Promise<Homepage> => {
    const response = await apiClient.get<Homepage>(`/cms/queries/homepage/${id}/`);
    return response.data;
  },

  /**
   * Update homepage (admin only - future)
   */
  updateHomepage: async (homepage: Partial<Homepage>): Promise<Homepage> => {
    const response = await apiClient.put<Homepage>(
      '/cms/commands/homepage/update/',
      homepage
    );
    return response.data;
  },

  /**
   * Get current navigation
   */
  getNavigation: async (): Promise<Navigation> => {
    const response = await apiClient.get<Navigation>('/cms/queries/navigation/current/');
    return response.data;
  },

  /**
   * Update navigation (admin only - future)
   */
  updateNavigation: async (navigation: Partial<Navigation>): Promise<Navigation> => {
    const response = await apiClient.put<Navigation>(
      '/cms/commands/navigation/update/',
      navigation
    );
    return response.data;
  },

  /**
   * Get current footer
   */
  getFooter: async (): Promise<Footer> => {
    const response = await apiClient.get<Footer>('/cms/queries/footer/current/');
    return response.data;
  },

  /**
   * Update footer (admin only - future)
   */
  updateFooter: async (footer: Partial<Footer>): Promise<Footer> => {
    const response = await apiClient.put<Footer>(
      '/cms/commands/footer/update/',
      footer
    );
    return response.data;
  },

  /**
   * Get service guarantees
   */
  getServiceGuarantees: async (): Promise<ServiceGuaranteeListResponse> => {
    const response = await apiClient.get<ServiceGuaranteeListResponse>(
      '/cms/queries/service-guarantees/'
    );
    return response.data;
  },

  /**
   * Create service guarantee (admin only - future)
   */
  createServiceGuarantee: async (
    guarantee: Partial<ServiceGuarantee>
  ): Promise<ServiceGuarantee> => {
    const response = await apiClient.post<ServiceGuarantee>(
      '/cms/commands/service-guarantees/',
      guarantee
    );
    return response.data;
  },

  /**
   * Update service guarantee (admin only - future)
   */
  updateServiceGuarantee: async (
    id: string,
    guarantee: Partial<ServiceGuarantee>
  ): Promise<ServiceGuarantee> => {
    const response = await apiClient.put<ServiceGuarantee>(
      `/cms/commands/service-guarantees/${id}/`,
      guarantee
    );
    return response.data;
  },
};


