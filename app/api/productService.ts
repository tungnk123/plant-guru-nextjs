const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/products';

export interface ProductData {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  description: string;
  sellerId: string;
  wikiId: string;
  productImages: string[];
}

export const fetchProducts = async (): Promise<ProductData[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<ProductData> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}; 