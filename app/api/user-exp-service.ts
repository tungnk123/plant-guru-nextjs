const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/users';

export interface UserExperience {
  experiencePoints: number;
}

export const fetchUserExperience = async (userId: string): Promise<UserExperience> => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}/experience-points`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user experience: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user experience:', error);
    throw error;
  }
};

// Function to determine user level based on experience points
export const getUserLevel = (experiencePoints: number): { level: number; nextLevelPoints: number | null } => {
  const x = 0.07; // XP factor
  const y = 2; // Growth factor
  let level = 0;
  let nextLevelPoints = null;

  // Calculate level based on experience points
  while (true) {
    const requiredXP = Math.pow(level + 1, y) / x; // Calculate required XP for the next level
    if (experiencePoints < requiredXP) {
      nextLevelPoints = requiredXP; // Set next level points
      break;
    }
    level++;
  }

  return { level, nextLevelPoints };
};
