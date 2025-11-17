'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Search,
  Filter,
  Eye,
  Trash2,
  Reply,
  Archive,
  RefreshCw,
  Calendar,
  User,
  MessageSquare,
  X,
  Send,
  CheckCircle,
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { contactApi, ContactMessage } from '@/lib/api/contact';

export default function ContactMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, statusFilter, pagination.current_page, searchQuery]);

  const checkAuth = () => {
    const userData = authApi.getCurrentUser();
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    if (userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(userData);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await contactApi.getContactMessages({
        status: statusFilter || undefined,
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchQuery || undefined,
      });

      setMessages(response.data.messages || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);

    // Mark as read if new
    if (message.status === 'new') {
      try {
        await contactApi.updateMessageStatus(message.id, 'read');
        fetchMessages();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setReplying(true);
    try {
      await contactApi.replyToMessage(selectedMessage.id, replyText);
      setShowReplyModal(false);
      setReplyText('');
      fetchMessages();
      if (selectedMessage) {
        const updated = await contactApi.getContactMessage(selectedMessage.id);
        setSelectedMessage(updated.data!);
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mengirim balasan');
    } finally {
      setReplying(false);
    }
  };

  const handleArchive = async (messageId: string) => {
    if (!confirm('Arsipkan pesan ini?')) return;

    try {
      await contactApi.updateMessageStatus(messageId, 'archived');
      fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      alert(error.message || 'Gagal mengarsipkan pesan');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Hapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      await contactApi.deleteMessage(messageId);
      fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus pesan');
    }
  };

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'new', label: 'Baru' },
    { value: 'read', label: 'Dibaca' },
    { value: 'replied', label: 'Dibalas' },
    { value: 'archived', label: 'Diarsipkan' },
  ];

  const stats = {
    total: pagination.total,
    new: messages.filter((m) => m.status === 'new').length,
    read: messages.filter((m) => m.status === 'read').length,
    replied: messages.filter((m) => m.status === 'replied').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesan Kontak
          </h1>
          <p className="text-gray-600">
            Kelola dan balas pesan dari pengunjung
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pesan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pesan Baru</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dibaca</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dibalas</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, email, atau subjek..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={fetchMessages}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Tidak ada pesan</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleViewMessage(message)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                      } ${message.status === 'new' ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 flex-1 mr-2">
                          {message.name}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${contactApi.getStatusColor(
                            message.status
                          )}`}
                        >
                          {contactApi.getStatusLabel(message.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 truncate">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        current_page: prev.current_page - 1,
                      }))
                    }
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.current_page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        current_page: prev.current_page + 1,
                      }))
                    }
                    disabled={pagination.current_page === pagination.total_pages}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <span>{selectedMessage.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${contactApi.getStatusColor(
                      selectedMessage.status
                    )}`}
                  >
                    {contactApi.getStatusLabel(selectedMessage.status)}
                  </span>
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                {selectedMessage.reply_message && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Balasan Anda
                    </h4>
                    <p className="text-sm text-green-700 whitespace-pre-wrap mb-2">
                      {selectedMessage.reply_message}
                    </p>
                    {selectedMessage.replied_at && (
                      <p className="text-xs text-green-600">
                        Dikirim:{' '}
                        {new Date(selectedMessage.replied_at).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    {selectedMessage.status === 'replied' ? 'Balas Lagi' : 'Balas'}
                  </button>
                  <button
                    onClick={() => handleArchive(selectedMessage.id)}
                    disabled={selectedMessage.status === 'archived'}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Archive className="w-4 h-4" />
                    Arsipkan
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pilih Pesan
                </h3>
                <p className="text-gray-600">
                  Pilih pesan dari daftar untuk melihat detail dan membalas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Balas Pesan</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Kepada:</p>
                <p className="font-semibold text-gray-900">
                  {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-sm text-gray-600 mt-2">Re: {selectedMessage.subject}</p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tulis balasan Anda di sini..."
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReply}
                disabled={replying || !replyText.trim()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Balasan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
