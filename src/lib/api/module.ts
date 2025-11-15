import apiClient from './client';

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_preview: number;
  lesson_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_preview: number;
  created_at: string;
  updated_at: string;
}

export interface CreateModuleRequest {
  title: string;
  description?: string;
  order_index?: number;
  is_preview?: number;
}

export interface UpdateModuleRequest {
  title?: string;
  description?: string;
  order_index?: number;
  is_preview?: number;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  order_index?: number;
  is_preview?: number;
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  type?: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  order_index?: number;
  is_preview?: number;
}

export interface ReorderModulesRequest {
  modules: Array<{
    id: string;
    order_index: number;
  }>;
}

export interface ModulesResponse {
  status: string;
  data: Module[];
}

export interface ModuleResponse {
  status: string;
  data: Module;
}

export interface LessonsResponse {
  status: string;
  data: Lesson[];
}

export interface LessonResponse {
  status: string;
  data: Lesson;
}

export interface DeleteResponse {
  status: string;
  message: string;
}

export const moduleApi = {
  // Get all modules for a course
  getCourseModules: async (courseId: string): Promise<ModulesResponse> => {
    const response = await apiClient.get<ModulesResponse>(`/courses/${courseId}/modules`);
    return response.data;
  },

  // Create a new module
  createModule: async (courseId: string, data: CreateModuleRequest): Promise<ModuleResponse> => {
    const response = await apiClient.post<ModuleResponse>(`/courses/${courseId}/modules`, data);
    return response.data;
  },

  // Update a module
  updateModule: async (moduleId: string, data: UpdateModuleRequest): Promise<ModuleResponse> => {
    const response = await apiClient.put<ModuleResponse>(`/modules/${moduleId}`, data);
    return response.data;
  },

  // Delete a module
  deleteModule: async (moduleId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete<DeleteResponse>(`/modules/${moduleId}`);
    return response.data;
  },

  // Reorder modules
  reorderModules: async (courseId: string, data: ReorderModulesRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(`/courses/${courseId}/modules/reorder`, data);
    return response.data;
  },

  // Get all lessons for a module
  getModuleLessons: async (moduleId: string): Promise<LessonsResponse> => {
    const response = await apiClient.get<LessonsResponse>(`/modules/${moduleId}/lessons`);
    return response.data;
  },

  // Create a new lesson
  createLesson: async (moduleId: string, data: CreateLessonRequest): Promise<LessonResponse> => {
    const response = await apiClient.post<LessonResponse>(`/modules/${moduleId}/lessons`, data);
    return response.data;
  },

  // Update a lesson
  updateLesson: async (lessonId: string, data: UpdateLessonRequest): Promise<LessonResponse> => {
    const response = await apiClient.put<LessonResponse>(`/lessons/${lessonId}`, data);
    return response.data;
  },

  // Delete a lesson
  deleteLesson: async (lessonId: string): Promise<DeleteResponse> => {
    const response = await apiClient.delete<DeleteResponse>(`/lessons/${lessonId}`);
    return response.data;
  },
};
