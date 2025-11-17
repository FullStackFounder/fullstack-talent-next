'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Calendar,
  Clock,
  User,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  ArrowLeft,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { blogApi, BlogPost, BlogComment } from '@/lib/api/blog';
import { authApi } from '@/lib/api/auth';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Comment state
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
    checkAuth();
  }, [slug]);

  const checkAuth = () => {
    const user = authApi.getCurrentUser();
    setIsAuthenticated(!!user);
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getPostBySlug(slug);
      const postData = response.data;

      if (postData) {
        setPost(postData);
        setLikesCount(postData.likes_count);

        // Fetch related posts if category exists
        if (postData.category_id) {
          const relatedResponse = await blogApi.getPosts({
            category_id: postData.category_id,
            status: 'published',
            per_page: 3,
          });
          const filtered = (relatedResponse.data?.posts || []).filter(
            (p) => p.id !== postData.id
          );
          setRelatedPosts(filtered.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await blogApi.toggleLike(post!.id);
      if (response.data) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likes_count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      await blogApi.createComment(post!.id, {
        content: commentContent,
        parent_id: replyingTo || undefined,
      });

      // Refresh post to get updated comments
      await fetchPost();
      setCommentContent('');
      setReplyingTo(null);
      alert('Komentar berhasil ditambahkan!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Gagal menambahkan komentar');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin!');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderComments = (comments: BlogComment[], level: number = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`${level > 0 ? 'ml-12' : ''} mb-6`}>
        <div className="flex gap-4">
          <img
            src={comment.user_avatar || '/default-avatar.png'}
            alt={comment.user_name || 'User'}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {comment.user_name || 'Anonymous'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              Balas
            </button>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {renderComments(comment.replies, level + 1)}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-blue-600">
                Blog
              </Link>
              {post.category_name && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-900">{post.category_name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            {post.category_name && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {post.category_name}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.reading_time_minutes} menit baca</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{post.views_count} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>

            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span>{post.comments_count} Komentar</span>
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-5 h-5 text-gray-500" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Card */}
          {post.author_name && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-12">
              <div className="flex gap-4">
                <img
                  src={post.author_avatar || '/default-avatar.png'}
                  alt={post.author_name}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {post.author_name}
                  </h3>
                  {post.author_bio && (
                    <p className="text-gray-600">{post.author_bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Komentar ({post.comments_count})
            </h2>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                {replyingTo && (
                  <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm text-blue-700">
                      Membalas komentar...
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Batal
                    </button>
                  </div>
                )}
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <div className="flex justify-end gap-2 mt-4">
                  {replyingTo && (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                <p className="text-gray-600 mb-4">
                  Login untuk menambahkan komentar
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-6">
                {renderComments(post.comments)}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artikel Terkait
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {relatedPost.featured_image_url && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />

      <style jsx global>{`
        .prose {
          color: #374151;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4 {
          color: #111827;
          font-weight: bold;
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .prose h1 {
          font-size: 2.25em;
        }

        .prose h2 {
          font-size: 1.875em;
        }

        .prose h3 {
          font-size: 1.5em;
        }

        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #1d4ed8;
        }

        .prose code {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }

        .prose pre {
          background-color: #23241f;
          color: #f8f8f2;
          border-radius: 0.5rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .prose pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          font-size: 0.875em;
          line-height: 1.7;
        }

        .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 2rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .prose img {
          border-radius: 0.5rem;
          margin: 2rem 0;
        }

        .prose ul,
        .prose ol {
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }

        .prose li {
          margin: 0.5rem 0;
        }
      `}</style>
    </>
  );
}
