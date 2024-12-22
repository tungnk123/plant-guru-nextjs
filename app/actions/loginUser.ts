import { toast } from 'react-hot-toast';

interface LoginResponse {
  userId: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/users/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email.trim(), 
        password: password.trim() 
      }),
    });

    const data = await response.json();

    if (response.status === 200 && data.userId) {
      toast.success('Login successful!');
      return {
        userId: data.userId
      };
    }

    toast.error('Invalid email or password');
    return null;

  } catch (error: any) {
    toast.error('Connection error. Please try again later.');
    return null;
  }
};