export interface Contribution {
  wikiId: string;
  wiki: any | null;
  contentSections: any[];
  status: number;
  rejectionReason: string | null;
  contributorId: string;
  contributor: any | null;
  content: string;
  id: string;
  createdAt: string;
  lastModifiedAt: string | null;
}

export async function fetchPendingContributions(wikiId: string): Promise<Contribution[]> {
  try {
    const response = await fetch(
      `https://un-silent-backend-develop.azurewebsites.net/api/Contributions/${wikiId}/pending-contributions`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending contributions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pending contributions:', error);
    throw error;
  }
} 