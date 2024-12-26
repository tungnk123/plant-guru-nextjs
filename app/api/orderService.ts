const ORDER_BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/orders';

export interface OrderData {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const createOrder = async (orderData: Pick<OrderData, 'userId' | 'productId' | 'quantity' | 'shippingAddress'>): Promise<OrderData> => {
  try {
    const response = await fetch(ORDER_BASE_URL, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrdersByUser = async (userId: string): Promise<OrderData[]> => {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}; 