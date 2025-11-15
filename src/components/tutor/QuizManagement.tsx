'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { quizApi, Quiz, QuizQuestion, CreateQuizRequest, CreateQuestionRequest } from '@/lib/api/quiz';

interface QuizManagementProps {
  lessonId: string;
  quizId?: string | null;
  onClose?: () => void;
}

export default function QuizManagement({ lessonId, quizId, onClose }: QuizManagementProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'settings' | 'questions' | 'statistics'>('settings');

  // Quiz settings form
  const [quizForm, setQuizForm] = useState<CreateQuizRequest>({
    title: '',
    description: '',
    duration_minutes: 30,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: 1,
    show_correct_answers: 1,
  });

  // Question builder state
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState<CreateQuestionRequest>({
    question_text: '',
    question_type: 'multiple_choice',
    points: 10,
    explanation: '',
    options: [
      { text: '', is_correct: 0 },
      { text: '', is_correct: 0 },
    ],
  });

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await quizApi.getQuizById(quizId);
      setQuiz(response.data);

      // Populate form with existing data
      setQuizForm({
        title: response.data.title,
        description: response.data.description || '',
        duration_minutes: response.data.duration_minutes,
        passing_score: response.data.passing_score,
        max_attempts: response.data.max_attempts || undefined,
        shuffle_questions: response.data.shuffle_questions,
        show_correct_answers: response.data.show_correct_answers,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal memuat quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuizSettings = async () => {
    try {
      setLoading(true);

      if (quizId) {
        // Update existing quiz
        await quizApi.updateQuiz(quizId, quizForm);
      } else {
        // Create new quiz
        const response = await quizApi.createQuiz(lessonId, quizForm);
        setQuiz(response.data);
      }

      alert('Quiz settings berhasil disimpan!');
      if (quizId) {
        fetchQuiz();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan quiz settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizId || !confirm('Apakah Anda yakin ingin menghapus quiz ini?')) {
      return;
    }

    try {
      await quizApi.deleteQuiz(quizId);
      alert('Quiz berhasil dihapus!');
      if (onClose) onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus quiz');
    }
  };

  // Question management
  const openQuestionBuilder = (question?: QuizQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        explanation: question.explanation || '',
        options: question.options?.map(opt => ({
          text: opt.option_text,
          is_correct: opt.is_correct || 0,
        })) || [{ text: '', is_correct: 0 }, { text: '', is_correct: 0 }],
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        question_text: '',
        question_type: 'multiple_choice',
        points: 10,
        explanation: '',
        options: [
          { text: '', is_correct: 0 },
          { text: '', is_correct: 0 },
        ],
      });
    }
    setShowQuestionBuilder(true);
  };

  const handleSaveQuestion = async () => {
    if (!quiz) {
      alert('Quiz belum dibuat. Simpan quiz settings terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);

      if (editingQuestion) {
        // Update existing question
        await quizApi.updateQuestion(editingQuestion.id, questionForm);
      } else {
        // Add new question
        await quizApi.addQuestion(quiz.id, questionForm);
      }

      setShowQuestionBuilder(false);
      fetchQuiz();
      alert('Question berhasil disimpan!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus question ini?')) {
      return;
    }

    try {
      await quizApi.deleteQuestion(questionId);
      fetchQuiz();
      alert('Question berhasil dihapus!');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus question');
    }
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...(questionForm.options || []), { text: '', is_correct: 0 }],
    });
  };

  const removeOption = (index: number) => {
    const options = questionForm.options || [];
    if (options.length > 2) {
      setQuestionForm({
        ...questionForm,
        options: options.filter((_, i) => i !== index),
      });
    }
  };

  const updateOption = (index: number, field: 'text' | 'is_correct', value: string | number) => {
    const options = [...(questionForm.options || [])];

    if (field === 'is_correct') {
      // For multiple choice, only one answer can be correct
      if (questionForm.question_type === 'multiple_choice') {
        options.forEach((opt, i) => {
          opt.is_correct = i === index ? 1 : 0;
        });
      } else {
        options[index].is_correct = value as number;
      }
    } else {
      options[index].text = value as string;
    }

    setQuestionForm({ ...questionForm, options });
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'Pilihan Ganda';
      case 'true_false':
        return 'Benar/Salah';
      case 'short_answer':
        return 'Jawaban Singkat';
      case 'essay':
        return 'Essay';
      default:
        return type;
    }
  };

  if (loading && !quiz) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {quiz ? quiz.title : 'Buat Quiz Baru'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {quiz
              ? `${quiz.questions?.length || 0} pertanyaan`
              : 'Tambahkan quiz untuk lesson ini'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView('settings')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeView === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Pengaturan
            </div>
          </button>
          <button
            onClick={() => setActiveView('questions')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeView === 'questions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            disabled={!quiz}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pertanyaan ({quiz?.questions?.length || 0})
            </div>
          </button>
          {quiz && (
            <button
              onClick={() => setActiveView('statistics')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeView === 'statistics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistik
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Settings Tab */}
      {activeView === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Quiz <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: React Hooks Quiz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={quizForm.description}
              onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jelaskan tentang quiz ini"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi (menit) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quizForm.duration_minutes}
                onChange={(e) => setQuizForm({ ...quizForm, duration_minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nilai Lulus (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quizForm.passing_score}
                onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimal Percobaan
              </label>
              <input
                type="number"
                value={quizForm.max_attempts || ''}
                onChange={(e) => setQuizForm({ ...quizForm, max_attempts: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Unlimited"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shuffle_questions"
                checked={quizForm.shuffle_questions === 1}
                onChange={(e) => setQuizForm({ ...quizForm, shuffle_questions: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="shuffle_questions" className="text-sm text-gray-700">
                Acak urutan pertanyaan
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show_correct_answers"
                checked={quizForm.show_correct_answers === 1}
                onChange={(e) => setQuizForm({ ...quizForm, show_correct_answers: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="show_correct_answers" className="text-sm text-gray-700">
                Tampilkan jawaban yang benar setelah quiz selesai
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {quiz && (
              <button
                onClick={handleDeleteQuiz}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Hapus Quiz
              </button>
            )}
            <button
              onClick={handleSaveQuizSettings}
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeView === 'questions' && quiz && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total poin: {quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0}
            </p>
            <button
              onClick={() => openQuestionBuilder()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Pertanyaan
            </button>
          </div>

          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="space-y-3">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 flex items-start gap-3">
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="flex-shrink-0 text-gray-500 hover:text-gray-700 mt-1"
                    >
                      {expandedQuestions.has(question.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Pertanyaan {index + 1}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                          {getQuestionTypeLabel(question.question_type)}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          {question.points} poin
                        </span>
                      </div>
                      <h4 className="text-base font-medium text-gray-900">
                        {question.question_text}
                      </h4>

                      {expandedQuestions.has(question.id) && question.options && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={option.id}
                              className={`p-2 rounded-lg text-sm ${
                                option.is_correct
                                  ? 'bg-green-50 border border-green-200 text-green-900'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {option.is_correct && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                <span>{String.fromCharCode(65 + optIndex)}. {option.option_text}</span>
                              </div>
                            </div>
                          ))}
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-900">
                                <strong>Penjelasan:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openQuestionBuilder(question)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pertanyaan</h3>
              <p className="text-gray-600 mb-6">Tambahkan pertanyaan untuk quiz ini</p>
              <button
                onClick={() => openQuestionBuilder()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Pertanyaan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeView === 'statistics' && quiz?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Total Percobaan</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {quiz.statistics.total_attempts}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Rata-rata Nilai</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {quiz.statistics.average_score.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Tingkat Kelulusan</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {quiz.statistics.pass_rate.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Question Builder Modal */}
      {showQuestionBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Pertanyaan <span className="text-red-500">*</span>
                </label>
                <select
                  value={questionForm.question_type}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="multiple_choice">Pilihan Ganda</option>
                  <option value="true_false">Benar/Salah</option>
                  <option value="short_answer">Jawaban Singkat</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pertanyaan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tulis pertanyaan di sini..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poin <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={questionForm.points}
                  onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              {(questionForm.question_type === 'multiple_choice' || questionForm.question_type === 'true_false') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Pilihan Jawaban <span className="text-red-500">*</span>
                    </label>
                    {questionForm.question_type === 'multiple_choice' && (
                      <button
                        onClick={addOption}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Tambah Pilihan
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {questionForm.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={option.is_correct === 1}
                          onChange={() => updateOption(index, 'is_correct', 1)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                        />
                        {questionForm.question_type === 'multiple_choice' && questionForm.options && questionForm.options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pilih satu jawaban yang benar dengan klik radio button
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penjelasan (Opsional)
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Penjelasan untuk jawaban yang benar..."
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowQuestionBuilder(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : (editingQuestion ? 'Simpan Perubahan' : 'Tambah Pertanyaan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
