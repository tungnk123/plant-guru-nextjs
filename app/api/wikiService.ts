// Define the type for a WikiCard
export interface WikiCard {
    id: string;
    title: string;
    description?: string;
    thumbnailImageUrl: string;
    upvotes: number;
    contributorCount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface Wiki {
    id: string;
    title: string;
    description: string;
    thumbnailImageUrl: string;
    contributorIds: string[];
    authorId: string;
    upvotes: number;
    downvotes: number;
    content: string;
    createdAt: string;
  }
  
  // Define a function to fetch the wiki cards using fetch
  export const fetchWikiCards = async (): Promise<WikiCard[]> => {
    try {
      const response = await fetch(
        'https://un-silent-backend-develop.azurewebsites.net/api/Wiki/GetWikiCards',
        {
          method: 'GET',
          headers: {
            Accept: '*/*',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: WikiCard[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching wiki cards:', error);
      throw error;
    }
  };

  export interface CreateWikiArticlePayload {
    title: string;
    description: string;
    thumbnailImageUrl: string;
    authorId: string;
    productIds: string[];
  }
  
  export const createWikiArticle = async (
    payload: CreateWikiArticlePayload
  ): Promise<{ id: string }> => {
    try {
      const response = await fetch(
        'https://un-silent-backend-develop.azurewebsites.net/api/Wiki/CreateWikiArticle',
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating wiki article:', error);
      throw error;
    }
  };
  
  const API_BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api';

  export const fetchWikiById = async (id: string): Promise<Wiki> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Wiki/GetWikiById/${id}`,
        {
          headers: {
            'accept': '*/*'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch wiki');
      }
  
      const data = await response.json();
      console.log('Wiki Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching wiki:', error);
      throw error;
    }
  };
  
  