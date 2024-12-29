const API_BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api';

export interface Contribution {
  wikiId: string;
  wiki: any | null;
  contentSections: any[];
  status: number;
  rejectionReason: string | null;
  contributorId: string;
  contributor: any | null;
  content: string;
  contributorsCount: number;
  authorId: string;
  createdAt: Date;
  id: string;
  lastModifiedAt: string | null;
}

export const fetchPendingContributions = async (wikiId: string): Promise<Contribution[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Contributions/${wikiId}/pending-contributions`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending contributions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pending contributions:', error);
    throw error;
  }
};

export const approveContribution = async (wikiId: string, contributionId: string): Promise<{ content: string; contributorsCount: number }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Contributions/${wikiId}/contributions/${contributionId}/approve`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to approve contribution');
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving contribution:', error);
    throw error;
  }
};

export const rejectContribution = async (wikiId: string, contributionId: string, reason: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Contributions/${wikiId}/contributions/${contributionId}/reject`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reason)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reject contribution');
    }
  } catch (error) {
    console.error('Error rejecting contribution:', error);
    throw error;
  }
}; 

export const fetchContributionHistory = async (wikiId: string): Promise<Contribution[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Contributions/${wikiId}/contribution-history`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch contribution history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching contribution history:', error);
    throw error;
  }
};

interface SubmitContributionRequest {
  content: string;
  contributorId: string;
}

interface SubmitContributionResponse {
  id: string;
  wikiId: string;
  content: string;
  status: number;
  contributorId: string;
}

export const submitContribution = async (
  wikiId: string, 
  content: string
): Promise<SubmitContributionResponse> => {
  try {
    // Get contributorId from localStorage
    const contributorId = localStorage.getItem('userId');
    if (!contributorId) {
      throw new Error('User not logged in');
    }

    const payload: SubmitContributionRequest = {
      content,
      contributorId
    };

    const response = await fetch(
      `${API_BASE_URL}/Contributions/${wikiId}/contributions`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to submit contribution');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting contribution:', error);
    throw error;
  }
};