'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  CheckSquare,
  FileCheck,
  Clock,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { moduleApi, Module, Lesson } from '@/lib/api/module';

interface CourseContentTabProps {
  courseId: string;
}

export default function CourseContentTab({ courseId }: CourseContentTabProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moduleLessons, setModuleLessons] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Drag and drop states
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<string | null>(null);
  const [dragOverModule, setDragOverModule] = useState<string | null>(null);
  const [dragOverLesson, setDragOverLesson] = useState<string | null>(null);

  // Form states for module
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    is_preview: 0,
  });

  // Form states for lesson
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content_url: '',
    duration_minutes: '',
    is_preview: 0,
  });

  // Fetch modules on mount
  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moduleApi.getCourseModules(courseId);
      setModules(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat modul');
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleLessons = async (moduleId: string) => {
    try {
      const response = await moduleApi.getModuleLessons(moduleId);
      setModuleLessons(prev => ({ ...prev, [moduleId]: response.data }));
    } catch (err: any) {
      console.error('Failed to fetch lessons:', err);
    }
  };

  const toggleModule = async (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
      // Fetch lessons if not already fetched
      if (!moduleLessons[moduleId]) {
        await fetchModuleLessons(moduleId);
      }
    }
    setExpandedModules(newExpanded);
  };

  // Module CRUD
  const openCreateModuleModal = () => {
    setEditingModule(null);
    setModuleForm({ title: '', description: '', is_preview: 0 });
    setShowModuleModal(true);
  };

  const openEditModuleModal = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      is_preview: module.is_preview,
    });
    setShowModuleModal(true);
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingModule) {
        // Update existing module
        await moduleApi.updateModule(editingModule.id, {
          title: moduleForm.title,
          description: moduleForm.description || undefined,
          is_preview: moduleForm.is_preview,
        });
      } else {
        // Create new module
        await moduleApi.createModule(courseId, {
          title: moduleForm.title,
          description: moduleForm.description || undefined,
          order_index: modules.length + 1,
          is_preview: moduleForm.is_preview,
        });
      }

      setShowModuleModal(false);
      fetchModules();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan modul');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus modul ini? Semua lesson di dalamnya akan ikut terhapus.')) {
      return;
    }

    try {
      await moduleApi.deleteModule(moduleId);
      fetchModules();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus modul');
    }
  };

  // Lesson CRUD
  const openCreateLessonModal = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      type: 'video',
      content_url: '',
      duration_minutes: '',
      is_preview: 0,
    });
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson: Lesson) => {
    setActiveModuleId(lesson.module_id);
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      content_url: lesson.content_url || '',
      duration_minutes: lesson.duration_minutes?.toString() || '',
      is_preview: lesson.is_preview,
    });
    setShowLessonModal(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeModuleId) return;

    try {
      const lessonData = {
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        type: lessonForm.type,
        content_url: lessonForm.content_url || undefined,
        duration_minutes: lessonForm.duration_minutes ? parseInt(lessonForm.duration_minutes) : undefined,
        is_preview: lessonForm.is_preview,
      };

      if (editingLesson) {
        // Update existing lesson
        await moduleApi.updateLesson(editingLesson.id, lessonData);
      } else {
        // Create new lesson
        const currentLessons = moduleLessons[activeModuleId] || [];
        await moduleApi.createLesson(activeModuleId, {
          ...lessonData,
          order_index: currentLessons.length + 1,
        });
      }

      setShowLessonModal(false);
      fetchModuleLessons(activeModuleId);
      fetchModules(); // Refresh to update lesson count
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lesson ini?')) {
      return;
    }

    try {
      await moduleApi.deleteLesson(lessonId);
      fetchModuleLessons(moduleId);
      fetchModules(); // Refresh to update lesson count
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus lesson');
    }
  };

  // Drag and Drop Handlers for Modules
  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleModuleDragOver = (e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverModule(moduleId);
  };

  const handleModuleDragLeave = () => {
    setDragOverModule(null);
  };

  const handleModuleDrop = async (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();

    if (!draggedModule || draggedModule === targetModuleId) {
      setDraggedModule(null);
      setDragOverModule(null);
      return;
    }

    // Reorder modules in local state
    const draggedIndex = modules.findIndex(m => m.id === draggedModule);
    const targetIndex = modules.findIndex(m => m.id === targetModuleId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newModules = [...modules];
    const [removed] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, removed);

    // Update local state optimistically
    setModules(newModules);
    setDraggedModule(null);
    setDragOverModule(null);

    // Prepare data for API
    const reorderData = {
      modules: newModules.map((module, index) => ({
        id: module.id,
        order_index: index + 1,
      })),
    };

    try {
      await moduleApi.reorderModules(courseId, reorderData);
    } catch (err: any) {
      // Revert on error
      alert(err.message || 'Gagal mengubah urutan modul');
      fetchModules();
    }
  };

  const handleModuleDragEnd = () => {
    setDraggedModule(null);
    setDragOverModule(null);
  };

  // Drag and Drop Handlers for Lessons
  const handleLessonDragStart = (e: React.DragEvent, lessonId: string) => {
    setDraggedLesson(lessonId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLessonDragOver = (e: React.DragEvent, lessonId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverLesson(lessonId);
  };

  const handleLessonDragLeave = () => {
    setDragOverLesson(null);
  };

  const handleLessonDrop = async (e: React.DragEvent, targetLessonId: string, moduleId: string) => {
    e.preventDefault();

    if (!draggedLesson || draggedLesson === targetLessonId) {
      setDraggedLesson(null);
      setDragOverLesson(null);
      return;
    }

    const lessons = moduleLessons[moduleId];
    if (!lessons) return;

    const draggedIndex = lessons.findIndex(l => l.id === draggedLesson);
    const targetIndex = lessons.findIndex(l => l.id === targetLessonId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLessons = [...lessons];
    const [removed] = newLessons.splice(draggedIndex, 1);
    newLessons.splice(targetIndex, 0, removed);

    // Update local state optimistically
    setModuleLessons(prev => ({
      ...prev,
      [moduleId]: newLessons,
    }));
    setDraggedLesson(null);
    setDragOverLesson(null);

    // Update each lesson's order_index
    try {
      for (let i = 0; i < newLessons.length; i++) {
        await moduleApi.updateLesson(newLessons[i].id, {
          order_index: i + 1,
        });
      }
    } catch (err: any) {
      // Revert on error
      alert(err.message || 'Gagal mengubah urutan lesson');
      fetchModuleLessons(moduleId);
    }
  };

  const handleLessonDragEnd = () => {
    setDraggedLesson(null);
    setDragOverLesson(null);
  };

  // Get lesson type icon
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckSquare className="w-4 h-4" />;
      case 'assignment':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'text':
        return 'Teks/Artikel';
      case 'quiz':
        return 'Kuis';
      case 'assignment':
        return 'Tugas';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Memuat konten kursus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Gagal memuat konten</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchModules}
              className="mt-3 text-red-700 font-medium hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Konten Kursus</h2>
          <p className="text-sm text-gray-600 mt-1">
            {modules.length} modul, {modules.reduce((sum, m) => sum + (m.lesson_count || 0), 0)} lesson
          </p>
        </div>
        <button
          onClick={openCreateModuleModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Modul
        </button>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada modul</h3>
          <p className="text-gray-600 mb-6">Mulai dengan menambahkan modul pertama untuk kursus ini</p>
          <button
            onClick={openCreateModuleModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Modul
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <div
              key={module.id}
              draggable
              onDragStart={(e) => handleModuleDragStart(e, module.id)}
              onDragOver={(e) => handleModuleDragOver(e, module.id)}
              onDragLeave={handleModuleDragLeave}
              onDrop={(e) => handleModuleDrop(e, module.id)}
              onDragEnd={handleModuleDragEnd}
              className={`bg-white border rounded-lg overflow-hidden transition-all ${
                draggedModule === module.id ? 'opacity-50 border-blue-400' :
                dragOverModule === module.id ? 'border-blue-500 border-2 shadow-lg' :
                'border-gray-200'
              }`}
            >
              {/* Module Header */}
              <div className="p-4 flex items-center gap-3">
                <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </button>

                <button
                  onClick={() => toggleModule(module.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-gray-700"
                >
                  {expandedModules.has(module.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Modul {index + 1}</span>
                    {module.is_preview === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        <Eye className="w-3 h-3" />
                        Preview
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mt-0.5">{module.title}</h3>
                  {module.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{module.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">{module.lesson_count || 0} lesson</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCreateLessonModal(module.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Tambah Lesson"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModuleModal(module)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Modul"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              {expandedModules.has(module.id) && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {moduleLessons[module.id]?.length === 0 || !moduleLessons[module.id] ? (
                    <div className="text-center py-8">
                      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Belum ada lesson di modul ini</p>
                      <button
                        onClick={() => openCreateLessonModal(module.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Lesson
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {moduleLessons[module.id]?.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          draggable
                          onDragStart={(e) => handleLessonDragStart(e, lesson.id)}
                          onDragOver={(e) => handleLessonDragOver(e, lesson.id)}
                          onDragLeave={handleLessonDragLeave}
                          onDrop={(e) => handleLessonDrop(e, lesson.id, module.id)}
                          onDragEnd={handleLessonDragEnd}
                          className={`bg-white border rounded-lg p-3 flex items-center gap-3 transition-all ${
                            draggedLesson === lesson.id ? 'opacity-50 border-blue-400' :
                            dragOverLesson === lesson.id ? 'border-blue-500 border-2 shadow-md' :
                            'border-gray-200'
                          }`}
                        >
                          <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-4 h-4" />
                          </button>

                          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                            {getLessonIcon(lesson.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Lesson {lessonIndex + 1}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                {getLessonTypeLabel(lesson.type)}
                              </span>
                              {lesson.is_preview === 1 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 mt-0.5">{lesson.title}</h4>
                            {lesson.duration_minutes && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration_minutes} menit
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditLessonModal(lesson)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Edit Lesson"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id, module.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Hapus Lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingModule ? 'Edit Modul' : 'Tambah Modul Baru'}
              </h2>
            </div>

            <form onSubmit={handleModuleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="module-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Modul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="module-title"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Introduction to React"
                  required
                />
              </div>

              <div>
                <label htmlFor="module-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="module-description"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan tentang modul ini"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="module-preview"
                  checked={moduleForm.is_preview === 1}
                  onChange={(e) => setModuleForm({ ...moduleForm, is_preview: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="module-preview" className="text-sm text-gray-700">
                  Jadikan modul ini sebagai preview (dapat diakses tanpa enrollment)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingModule ? 'Simpan Perubahan' : 'Tambah Modul'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingLesson ? 'Edit Lesson' : 'Tambah Lesson Baru'}
              </h2>
            </div>

            <form onSubmit={handleLessonSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="lesson-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Lesson <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lesson-title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Introduction to Hooks"
                  required
                />
              </div>

              <div>
                <label htmlFor="lesson-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Lesson <span className="text-red-500">*</span>
                </label>
                <select
                  id="lesson-type"
                  value={lessonForm.type}
                  onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="video">Video</option>
                  <option value="text">Teks/Artikel</option>
                  <option value="quiz">Kuis</option>
                  <option value="assignment">Tugas</option>
                </select>
              </div>

              <div>
                <label htmlFor="lesson-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="lesson-description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan tentang lesson ini"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="lesson-content-url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Konten {lessonForm.type === 'video' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id="lesson-content-url"
                  value={lessonForm.content_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, content_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    lessonForm.type === 'video'
                      ? 'Video ID dari streaming service'
                      : 'URL konten (opsional)'
                  }
                  required={lessonForm.type === 'video'}
                />
              </div>

              <div>
                <label htmlFor="lesson-duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi (menit)
                </label>
                <input
                  type="number"
                  id="lesson-duration"
                  value={lessonForm.duration_minutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                  min="1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lesson-preview"
                  checked={lessonForm.is_preview === 1}
                  onChange={(e) => setLessonForm({ ...lessonForm, is_preview: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="lesson-preview" className="text-sm text-gray-700">
                  Jadikan lesson ini sebagai preview (dapat diakses tanpa enrollment)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLesson ? 'Simpan Perubahan' : 'Tambah Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
