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
    console.log('Login API Response:', data);

    if (response.status === 200 && data.userId) {
      // Clear any old data first
      localStorage.clear();
      
      // Store the new userId
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('loginTime', Date.now().toString());
      console.log('Stored new userId:', data.userId);

      toast.success('Login successful!');
      
      // Redirect to home page
      window.location.href = '/home';
      
      return {
        userId: data.userId
      };
    }

    console.log('Login failed:', response.status, data);
    toast.error('Invalid email or password');
    return null;

  } catch (error: any) {
    console.error('Login error:', error);
    toast.error('Connection error. Please try again later.');
    return null;
  }
};