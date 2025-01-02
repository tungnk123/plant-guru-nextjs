export interface QuizQuestion {
    questionId: string;
    content: string;
    options: string[];
    correctOptionIndex: number;
  }
  
  export interface Quiz {
    quizId: string;
    topic: string;
    questions: QuizQuestion[];
    createdAt: string;
    createdBy: string;
  }
  
  export interface CreateQuizRequest {
    topic: string;
    numberOfQuestions: number;
  }
  
  export interface CreateQuizResponse {
    quiz: Quiz;
  }
  
  const BASE_URL = "https://localhost:7282/api/Quiz";
  
  export const createQuiz = async (data: CreateQuizRequest): Promise<CreateQuizResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create quiz: ${response.statusText}`);
      }
  
      const result: CreateQuizResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  };
  