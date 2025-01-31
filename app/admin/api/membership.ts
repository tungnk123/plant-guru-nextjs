const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/membership';

// Type definitions for Membership
export interface Membership {
  id?: string;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  lastModifiedAt?: string | null;
}

export interface MembershipHistory {
  userId: string;
  name: string;
  email: string;
  packageName: string;
  packagePrice: number;
  boughtAt: string;
}

// API service for Membership
class MembershipService {
  // Fetch all memberships
  static async getMemberships(): Promise<Membership[]> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch memberships: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    }
  }

  // Fetch a specific membership by ID
  static async getMembershipById(id: string): Promise<Membership> {
    try {
      const url = `${BASE_URL}/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch membership with ID ${id}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Create a new membership
  static async createMembership(data: Membership): Promise<Membership> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create membership: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Update an existing membership
  static async updateMembership(data: Membership): Promise<Membership> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update membership: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Delete a membership
  static async deleteMembership(id: string): Promise<void> {
    try {
      const url = `${BASE_URL}?id=${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete membership: ${response.statusText}`);
      }

      console.log(`Membership with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Fetch membership history
  static async getMembershipHistory(): Promise<MembershipHistory[]> {
    try {
      const url = `${BASE_URL}/membershipHistory`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch membership history: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Membership History:', data);
      return data;
    } catch (error) {
      console.error('Error fetching membership history:', error);
      throw error;
    }
  }
}

export default MembershipService;
