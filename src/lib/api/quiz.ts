import apiClient from './client';

export interface QuizOption {
  id: string;
  option_text: string;
  is_correct?: number;
  order_index: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points: number;
  explanation?: string | null;
  order_index: number;
  options?: QuizOption[];
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  passing_score: number;
  max_attempts: number | null;
  shuffle_questions: number;
  show_correct_answers: number;
  questions?: QuizQuestion[];
  statistics?: {
    total_attempts: number;
    average_score: number;
    pass_rate: number;
  };
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  attempt_number: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number | null;
  passed: number | null;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number | null;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
  max_attempts?: number;
  shuffle_questions?: number;
  show_correct_answers?: number;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  max_attempts?: number;
  shuffle_questions?: number;
  show_correct_answers?: number;
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points: number;
  explanation?: string;
  options?: Array<{
    text: string;
    is_correct: number;
  }>;
}

export interface UpdateQuestionRequest {
  question_text?: string;
  question_type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points?: number;
  explanation?: string;
  options?: Array<{
    id?: string;
    text: string;
    is_correct: number;
  }>;
}

export interface SubmitAnswerRequest {
  question_id: string;
  selected_option_id?: string;
  answer_text?: string;
}

export interface QuizResponse {
  status: string;
  data: Quiz;
}

export interface QuizAttemptResponse {
  status: string;
  message: string;
  data: {
    attempt: QuizAttempt;
    quiz: {
      title: string;
      duration_minutes: number;
      total_questions: number;
    };
  };
}

export interface QuizResultResponse {
  status: string;
  message: string;
  data: {
    attempt: QuizAttempt;
    score: number;
    passed: boolean;
    total_points: number;
    earned_points: number;
    passing_score: number;
    time_spent_seconds: number;
    answers: Array<{
      question_id: string;
      question_text: string;
      selected_option: any;
      correct_option: any;
      is_correct: boolean;
      points_earned: number;
      explanation: string;
    }>;
  };
}

export interface QuestionResponse {
  status: string;
  data: QuizQuestion;
}

export interface DeleteResponse {
  status: string;
  message: string;
}

export const quizApi = {
  // Get quiz details with questions
  getQuizById: async (quizId: string): Promise<QuizResponse> => {
    const response = await apiClient.get<QuizResponse>(`/quizzes/${quizId}`);
    return response.data;
  },

  // Create a new quiz for a lesson
  createQuiz: async (lessonId: string, data: CreateQuizRequest): Promise<QuizResponse> => {
    const response = await apiClient.post<QuizResponse>(`/lessons/${lessonId}/quizzes`, data);
    return response.data;
  },

  // Update a quiz
  updateQuiz: async (quizId: string, data: UpdateQuizRequest): Promise<QuizResponse> => {
    const response = await apiClient.put<QuizResponse>(`/quizzes/${quizId}`, data);
    return response.data;
  },

  // Delete a quiz
  deleteQuiz: async (quizId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete<DeleteResponse>(`/quizzes/${quizId}`);
    return response.data;
  },

  // Add a question to a quiz
  addQuestion: async (quizId: string, data: CreateQuestionRequest): Promise<QuestionResponse> => {
    const response = await apiClient.post<QuestionResponse>(`/quizzes/${quizId}/questions`, data);
    return response.data;
  },

  // Update a question
  updateQuestion: async (questionId: string, data: UpdateQuestionRequest): Promise<QuestionResponse> => {
    const response = await apiClient.put<QuestionResponse>(`/questions/${questionId}`, data);
    return response.data;
  },

  // Delete a question
  deleteQuestion: async (questionId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete<DeleteResponse>(`/questions/${questionId}`);
    return response.data;
  },

  // Quiz Attempts (Student-side)
  // Start a quiz attempt
  startQuizAttempt: async (quizId: string): Promise<QuizAttemptResponse> => {
    const response = await apiClient.post<QuizAttemptResponse>(`/quizzes/${quizId}/attempts/start`);
    return response.data;
  },

  // Submit an answer during an attempt
  submitAnswer: async (attemptId: string, data: SubmitAnswerRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(`/attempts/${attemptId}/answers`, data);
    return response.data;
  },

  // Submit the entire quiz
  submitQuiz: async (attemptId: string): Promise<QuizResultResponse> => {
    const response = await apiClient.post<QuizResultResponse>(`/attempts/${attemptId}/submit`);
    return response.data;
  },

  // Get quiz results for an attempt
  getQuizResults: async (attemptId: string): Promise<QuizResultResponse> => {
    const response = await apiClient.get<QuizResultResponse>(`/attempts/${attemptId}/results`);
    return response.data;
  },

  // Get all my attempts for a quiz
  getMyAttempts: async (quizId: string): Promise<{ status: string; data: QuizAttempt[] }> => {
    const response = await apiClient.get<{ status: string; data: QuizAttempt[] }>(`/quizzes/${quizId}/my-attempts`);
    return response.data;
  },

  // Abandon an attempt
  abandonAttempt: async (attemptId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(`/attempts/${attemptId}/abandon`);
    return response.data;
  },
};
