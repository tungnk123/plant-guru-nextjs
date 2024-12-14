'use client';

import { useEffect } from 'react';

export default function TestApi() {
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Start call API:');
        const response = await fetch(
          `https://un-silent-backend-develop.azurewebsites.net/api/posts/test/get-all`,
          {
            method: 'GET',
            headers: {
              Accept: '*/*',
            },
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch API:', response.status, response.statusText);
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }

    fetchData();
  }, []);

  return <div>Check console for API response.</div>;
}
