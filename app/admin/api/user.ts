import { da } from "@faker-js/faker";

export interface User {
  id: string;
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
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: User[] = await response.json();
    console.log("Get data: ", data)
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

// Upgrade user to premium
export async function goPremium(userId: string, packageName: string = 'STANDARD', packagePrice: number = 19.99): Promise<void> {
  try {
    const response = await fetch(
      'https://un-silent-backend-develop.azurewebsites.net/api/users/goPremium',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, packageName, packagePrice }), // Pass package details in request body
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upgrade user to premium: ${response.statusText}`);
    }

    console.log(`User ${userId} upgraded to premium successfully with package: ${packageName} at $${packagePrice}.`);
  } catch (error) {
    console.error(`Error upgrading user ${userId} to premium:`, error);
    throw error;
  }
}


// Remove premium status from a user
export async function removePremium(userId: string): Promise<void> {
  try {
    const response = await fetch(
      `https://un-silent-backend-develop.azurewebsites.net/api/users/removePremium?userId=${userId}`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
        },
        body: '', // Explicitly include an empty body for the POST request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove premium status: ${response.statusText}`);
    }

    console.log(`User ${userId} premium status removed successfully.`);
  } catch (error) {
    console.error(`Error removing premium status for user ${userId}:`, error);
    throw error;
  }
}

// Set name and avatar for a user
export async function setNameAndAvatar(userId: string, name: string, avatar: string): Promise<void> {
  try {
    const response = await fetch(
      'https://un-silent-backend-develop.azurewebsites.net/api/users/setNameAndAvatar',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, name, avatar }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set name and avatar: ${response.statusText}`);
    }

    console.log(`User ${userId} updated with name: ${name} and avatar: ${avatar}`);
  } catch (error) {
    console.error(`Error setting name and avatar for user ${userId}:`, error);
    throw error;
  }
}


export async function addUser(
  email: string,
  password: string,
  name: string,
  avatar: string
): Promise<{ userId: string }> {
  try {
    const response = await fetch(
      'https://un-silent-backend-develop.azurewebsites.net/api/users/signUp',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, avatar }), // Include name and avatar
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add user');
    }

    const data = await response.json();
    return data; // { userId: string }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}




