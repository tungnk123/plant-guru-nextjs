export interface User {
  userId: string;
  name: string;
  avatar: string;
  email: string;
  isHavePremium: boolean;
}

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/users', {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: User[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Fetch user by ID
export async function fetchUserById(userId: string): Promise<User> {
  try {
    const response = await fetch(
      `https://un-silent-backend-develop.azurewebsites.net/api/users/${userId}`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user by ID: ${response.statusText}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
}
