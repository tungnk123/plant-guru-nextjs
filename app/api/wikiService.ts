// Define the type for a WikiCard
export interface WikiCard {
    id: string;
    thumbnailImageUrl: string;
    title: string;
    upvotes: number;
    contributorCount: number;
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
  ): Promise<void> => {
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
  
      console.log('Wiki article created successfully');
    } catch (error) {
      console.error('Error creating wiki article:', error);
      throw error;
    }
  };
  
  