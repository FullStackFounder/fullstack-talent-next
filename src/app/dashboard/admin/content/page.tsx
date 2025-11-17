'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  Star,
  Clock,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  blogApi,
  BlogPost,
  BlogCategory,
  BlogComment,
  PostFilters,
  CreatePostData,
  CreateCategoryData,
} from '@/lib/api/blog';
import { uploadApi } from '@/lib/api/upload';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'comments'>('posts');
  const [loading, setLoading] = useState(true);

  // Posts state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postFilters, setPostFilters] = useState<PostFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [postSearch, setPostSearch] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Categories state
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

  // Comments state
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentFilters, setCommentFilters] = useState({ page: 1, per_page: 20, status: undefined });

  // Statistics
  const [stats, setStats] = useState({
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    total_categories: 0,
    total_comments: 0,
    pending_comments: 0,
    total_views: 0,
    total_likes: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, postFilters, commentFilters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        await fetchPosts();
        await fetchCategories(); // For filters
      } else if (activeTab === 'categories') {
        await fetchCategories();
      } else if (activeTab === 'comments') {
        await fetchComments();
      }
      await fetchStats();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    const response = await blogApi.getPosts(postFilters);
    setPosts(response.data?.posts || []);
  };

  const fetchCategories = async () => {
    const response = await blogApi.getCategories();
    setCategories(response.data || []);
  };

  const fetchComments = async () => {
    const response = await blogApi.getAllComments(commentFilters);
    setComments(response.data?.comments || []);
  };

  const fetchStats = async () => {
    // Calculate stats from data
    const allPosts = await blogApi.getPosts({});
    const allComments = await blogApi.getAllComments({});

    const postsData = allPosts.data?.posts || [];
    const commentsData = allComments.data?.comments || [];

    setStats({
      total_posts: postsData.length,
      published_posts: postsData.filter((p: BlogPost) => p.status === 'published').length,
      draft_posts: postsData.filter((p: BlogPost) => p.status === 'draft').length,
      total_categories: categories.length,
      total_comments: commentsData.length,
      pending_comments: commentsData.filter((c: BlogComment) => c.status === 'pending').length,
      total_views: postsData.reduce((sum: number, p: BlogPost) => sum + p.views_count, 0),
      total_likes: postsData.reduce((sum: number, p: BlogPost) => sum + p.likes_count, 0),
    });
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowPostModal(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus post ini?')) return;

    try {
      await blogApi.deletePost(postId);
      alert('Post berhasil dihapus');
      fetchPosts();
    } catch (error) {
      alert('Gagal menghapus post');
      console.error(error);
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    try {
      await blogApi.toggleFeatured(postId);
      fetchPosts();
    } catch (error) {
      alert('Gagal mengubah status featured');
      console.error(error);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;

    try {
      await blogApi.deleteCategory(categoryId);
      alert('Kategori berhasil dihapus');
      fetchCategories();
    } catch (error) {
      alert('Gagal menghapus kategori');
      console.error(error);
    }
  };

  const handleUpdateCommentStatus = async (commentId: string, status: 'pending' | 'approved' | 'spam') => {
    try {
      await blogApi.updateCommentStatus(commentId, status);
      fetchComments();
    } catch (error) {
      alert('Gagal mengubah status komentar');
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

    try {
      await blogApi.deleteComment(commentId);
      alert('Komentar berhasil dihapus');
      fetchComments();
    } catch (error) {
      alert('Gagal menghapus komentar');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      spam: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Kelola blog posts, kategori, dan komentar</p>
          </div>
          {activeTab === 'posts' && (
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Buat Post Baru
            </button>
          )}
          {activeTab === 'categories' && (
            <button
              onClick={handleCreateCategory}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Buat Kategori
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_posts}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.published_posts} published, {stats.draft_posts} draft
                </p>
              </div>
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_categories}</p>
              </div>
              <FolderOpen className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_comments}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.pending_comments} pending</p>
              </div>
              <MessageSquare className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_views.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.total_likes} likes</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Posts
                </div>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Categories
                </div>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'comments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments
                  {stats.pending_comments > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pending_comments}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari judul post..."
                        value={postSearch}
                        onChange={(e) => {
                          setPostSearch(e.target.value);
                          setPostFilters({ ...postFilters, search: e.target.value });
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <select
                    value={postFilters.status || ''}
                    onChange={(e) =>
                      setPostFilters({ ...postFilters, status: e.target.value as any })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={postFilters.category_id || ''}
                    onChange={(e) =>
                      setPostFilters({ ...postFilters, category_id: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={postFilters.is_featured?.toString() || ''}
                    onChange={(e) =>
                      setPostFilters({
                        ...postFilters,
                        is_featured: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Posts</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Non-Featured</option>
                  </select>
                </div>

                {/* Posts List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600 mt-4">Belum ada post</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {post.featured_image_url && (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {post.title}
                                  </h3>
                                  {post.is_featured && (
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {post.author_name || 'Unknown'}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(post.created_at)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {post.views_count}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    {post.likes_count}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    {post.comments_count}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {post.reading_time_minutes || 0} min
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  {getStatusBadge(post.status)}
                                  {post.category_name && (
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                      {post.category_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleToggleFeatured(post.id)}
                              className={`p-2 rounded-lg ${
                                post.is_featured
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={post.is_featured ? 'Unfeature' : 'Feature'}
                            >
                              <Star className={`w-5 h-5 ${post.is_featured ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600 mt-4">Belum ada kategori</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">/{category.slug}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {category.description && (
                          <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {category.posts_count} posts
                          </span>
                          <span className="text-gray-400">
                            {formatDate(category.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                {/* Comment Filters */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCommentFilters({ ...commentFilters, status: undefined })}
                    className={`px-4 py-2 rounded-lg ${
                      !commentFilters.status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setCommentFilters({ ...commentFilters, status: 'pending' })}
                    className={`px-4 py-2 rounded-lg ${
                      commentFilters.status === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending ({stats.pending_comments})
                  </button>
                  <button
                    onClick={() => setCommentFilters({ ...commentFilters, status: 'approved' })}
                    className={`px-4 py-2 rounded-lg ${
                      commentFilters.status === 'approved'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setCommentFilters({ ...commentFilters, status: 'spam' })}
                    className={`px-4 py-2 rounded-lg ${
                      commentFilters.status === 'spam'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Spam
                  </button>
                </div>

                {/* Comments List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600 mt-4">Belum ada komentar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={comment.user_avatar || '/default-avatar.png'}
                            alt={comment.user_name || 'User'}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {comment.user_name || 'Unknown User'}
                              </span>
                              <span className="text-gray-400 text-sm">
                                • {formatDate(comment.created_at)}
                              </span>
                              {getStatusBadge(comment.status)}
                            </div>
                            <p className="text-gray-700 mb-3">{comment.content}</p>
                            {comment.parent_id && (
                              <p className="text-sm text-gray-500 mb-3">
                                Balasan dari komentar lain
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              {comment.status !== 'approved' && (
                                <button
                                  onClick={() => handleUpdateCommentStatus(comment.id, 'approved')}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                              )}
                              {comment.status !== 'spam' && (
                                <button
                                  onClick={() => handleUpdateCommentStatus(comment.id, 'spam')}
                                  className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  Mark as Spam
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Modal (Create/Edit) */}
        {showPostModal && (
          <PostModal
            post={editingPost}
            categories={categories}
            onClose={() => setShowPostModal(false)}
            onSave={() => {
              setShowPostModal(false);
              fetchPosts();
            }}
          />
        )}

        {/* Category Modal (Create/Edit) */}
        {showCategoryModal && (
          <CategoryModal
            category={editingCategory}
            onClose={() => setShowCategoryModal(false)}
            onSave={() => {
              setShowCategoryModal(false);
              fetchCategories();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Post Modal Component
function PostModal({
  post,
  categories,
  onClose,
  onSave,
}: {
  post: BlogPost | null;
  categories: BlogCategory[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<CreatePostData>({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featured_image_url: post?.featured_image_url || '',
    status: post?.status || 'draft',
    is_featured: post?.is_featured || false,
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    category_id: post?.category_id || '',
    tags: post?.tags?.map((t) => t.name) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (post) {
        await blogApi.updatePost(post.id, formData);
        alert('Post berhasil diupdate');
      } else {
        await blogApi.createPost(formData);
        alert('Post berhasil dibuat');
      }
      onSave();
    } catch (error) {
      alert('Gagal menyimpan post');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full my-8">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">
            {post ? 'Edit Post' : 'Buat Post Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Tulis konten artikel dengan dukungan code syntax highlighting..."
              height="500px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <ImageUpload
              value={formData.featured_image_url}
              onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
              onUpload={async (file) => {
                try {
                  const url = await uploadApi.uploadImage(file, 'blog');
                  return url;
                } catch (error: any) {
                  throw new Error(error.message || 'Upload failed');
                }
              }}
              label="Featured Image"
              aspectRatio="16/9"
              maxSizeMB={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 mt-8">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags?.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter((t) => t),
                })
              }
              placeholder="React, JavaScript, Web Development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (SEO)
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </form>

        <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 rounded-b-lg">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {post ? 'Update' : 'Buat'} Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: BlogCategory | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (category) {
        await blogApi.updateCategory(category.id, formData);
        alert('Kategori berhasil diupdate');
      } else {
        await blogApi.createCategory(formData);
        alert('Kategori berhasil dibuat');
      }
      onSave();
    } catch (error) {
      alert('Gagal menyimpan kategori');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {category ? 'Edit Kategori' : 'Buat Kategori Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (optional)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {category ? 'Update' : 'Buat'} Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
