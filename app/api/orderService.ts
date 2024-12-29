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

export const fetchOrdersForShop = async (shopId: string): Promise<OrderData[]> => {
  try {
    const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/orders/shops/${shopId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shop orders:', error);
    throw error;
  }
};

export const confirmOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/orders/confirmOrder?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm order: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};

export const denyOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/orders/markAsFailedOrder?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to deny order: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error denying order:', error);
    throw error;
  }
}; 