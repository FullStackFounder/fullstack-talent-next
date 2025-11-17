# Blog API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Endpoints](#endpoints)
   - [Blog Posts](#blog-posts)
   - [Categories](#categories)
   - [Comments](#comments)
   - [Likes](#likes)
   - [Tags](#tags)
5. [Data Models](#data-models)
6. [Status Codes](#status-codes)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

---

## Overview

Blog API untuk platform **Fullstack Talent** menyediakan endpoints untuk mengelola konten blog termasuk artikel, kategori, komentar, dan interaksi pengguna.

### Features
- ✅ CRUD operations untuk blog posts
- ✅ Category management
- ✅ Comment & reply system
- ✅ Like/unlike posts
- ✅ Tag system
- ✅ Search & filtering
- ✅ Pagination
- ✅ View tracking
- ✅ Featured & popular posts

---

## Authentication

Sebagian besar endpoints memerlukan autentikasi menggunakan **JWT Bearer Token**.

### Header Format
```
Authorization: Bearer {your_jwt_token}
```

### Role-based Access
- **Public**: Semua user (tanpa login)
- **Student**: User dengan role siswa
- **Tutor**: User dengan role tutor
- **Admin**: User dengan role admin

---

## Base URL

```
Production: https://api.fullstacktalent.id/api/blog
Development: http://localhost:8080/api/blog
```

---

## Endpoints

### Blog Posts

#### 1. Get All Posts

Mendapatkan daftar semua blog posts dengan pagination dan filtering.

**Endpoint:**
```
GET /posts
```

**Access:** Public

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Halaman (default: 1) |
| per_page | integer | No | Jumlah per halaman (default: 10, max: 50) |
| status | string | No | Filter by status: `draft`, `published`, `archived` |
| category_id | string | No | Filter by category UUID |
| author_id | string | No | Filter by author UUID |
| is_featured | boolean | No | Filter featured posts (1 or 0) |
| search | string | No | Search in title, excerpt, content |

**Example Request:**
```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts?page=1&per_page=10&status=published&search=react"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Blog posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "author_id": "author-uuid",
        "category_id": "category-uuid",
        "title": "Panduan Lengkap Belajar React untuk Pemula",
        "slug": "panduan-lengkap-belajar-react-untuk-pemula",
        "excerpt": "React adalah library JavaScript populer untuk membangun UI...",
        "content": "Full content here...",
        "featured_image_url": "https://cdn.fullstacktalent.id/images/react-guide.jpg",
        "status": "published",
        "visibility": "public",
        "reading_time_minutes": 8,
        "views_count": 1523,
        "likes_count": 234,
        "comments_count": 45,
        "is_featured": true,
        "allow_comments": true,
        "published_at": "2025-11-15T10:00:00Z",
        "created_at": "2025-11-14T15:30:00Z",
        "updated_at": "2025-11-15T10:00:00Z",
        "author_name": "John Doe",
        "author_avatar": "https://cdn.fullstacktalent.id/avatars/john.jpg",
        "category_name": "Web Development",
        "category_slug": "web-development"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 156,
      "total_pages": 16
    }
  }
}
```

---

#### 2. Get Single Post

Mendapatkan detail lengkap satu blog post berdasarkan slug.

**Endpoint:**
```
GET /posts/{slug}
```

**Access:** Public

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | URL-friendly post slug |

**Example Request:**
```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/panduan-lengkap-belajar-react-untuk-pemula"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Blog post retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "author_id": "author-uuid",
    "category_id": "category-uuid",
    "title": "Panduan Lengkap Belajar React untuk Pemula",
    "slug": "panduan-lengkap-belajar-react-untuk-pemula",
    "excerpt": "React adalah library JavaScript populer...",
    "content": "<h2>Apa itu React?</h2><p>React adalah...</p>",
    "featured_image_url": "https://cdn.fullstacktalent.id/images/react-guide.jpg",
    "status": "published",
    "visibility": "public",
    "reading_time_minutes": 8,
    "views_count": 1524,
    "likes_count": 234,
    "comments_count": 45,
    "is_featured": true,
    "allow_comments": true,
    "meta_title": "Panduan Lengkap Belajar React 2025",
    "meta_description": "Tutorial React dari dasar hingga mahir...",
    "published_at": "2025-11-15T10:00:00Z",
    "created_at": "2025-11-14T15:30:00Z",
    "updated_at": "2025-11-15T10:00:00Z",
    "author_name": "John Doe",
    "author_avatar": "https://cdn.fullstacktalent.id/avatars/john.jpg",
    "author_bio": "Full-stack developer dengan 5+ tahun pengalaman",
    "category_name": "Web Development",
    "category_slug": "web-development",
    "tags": [
      {
        "id": "tag-uuid-1",
        "name": "React",
        "slug": "react"
      },
      {
        "id": "tag-uuid-2",
        "name": "JavaScript",
        "slug": "javascript"
      }
    ],
    "comments": [
      {
        "id": "comment-uuid",
        "user_id": "user-uuid",
        "content": "Artikel yang sangat membantu!",
        "likes_count": 12,
        "created_at": "2025-11-15T12:00:00Z",
        "user_name": "Jane Smith",
        "user_avatar": "https://cdn.fullstacktalent.id/avatars/jane.jpg",
        "replies": [
          {
            "id": "reply-uuid",
            "user_id": "author-uuid",
            "content": "Terima kasih! Senang bisa membantu",
            "created_at": "2025-11-15T13:00:00Z",
            "user_name": "John Doe",
            "user_avatar": "https://cdn.fullstacktalent.id/avatars/john.jpg"
          }
        ]
      }
    ],
    "related_posts": [
      {
        "id": "related-post-uuid",
        "title": "React Hooks: useState dan useEffect",
        "slug": "react-hooks-usestate-useeffect",
        "excerpt": "Memahami React Hooks...",
        "featured_image_url": "https://cdn.fullstacktalent.id/images/hooks.jpg",
        "published_at": "2025-11-10T10:00:00Z"
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "message": "Blog post not found"
}
```

---

#### 3. Create Post

Membuat blog post baru (Admin/Tutor only).

**Endpoint:**
```
POST /posts
```

**Access:** Admin, Tutor

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Panduan Lengkap Belajar React untuk Pemula",
  "content": "<h2>Apa itu React?</h2><p>React adalah library JavaScript...</p>",
  "category_id": "category-uuid",
  "excerpt": "React adalah library JavaScript populer untuk membangun UI interaktif",
  "featured_image_url": "https://cdn.fullstacktalent.id/images/react-guide.jpg",
  "status": "published",
  "visibility": "public",
  "is_featured": false,
  "allow_comments": true,
  "meta_title": "Panduan Lengkap Belajar React 2025",
  "meta_description": "Tutorial React dari dasar hingga mahir untuk pemula",
  "tags": ["React", "JavaScript", "Web Development"]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Judul artikel (10-255 karakter) |
| content | string | Yes | Konten artikel HTML (min 100 karakter) |
| category_id | string | No | UUID kategori |
| excerpt | string | No | Ringkasan artikel (max 500 karakter) |
| featured_image_url | string | No | URL gambar utama |
| status | string | No | Status: `draft` atau `published` (default: draft) |
| visibility | string | No | `public`, `members_only`, `private` (default: public) |
| is_featured | boolean | No | Tampilkan di featured section |
| allow_comments | boolean | No | Izinkan komentar (default: true) |
| meta_title | string | No | SEO title (max 60 karakter) |
| meta_description | string | No | SEO description (max 160 karakter) |
| tags | array | No | Array nama tag |

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Blog post created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "author_id": "author-uuid",
    "title": "Panduan Lengkap Belajar React untuk Pemula",
    "slug": "panduan-lengkap-belajar-react-untuk-pemula",
    "status": "published",
    "reading_time_minutes": 8,
    "published_at": "2025-11-17T10:00:00Z",
    "created_at": "2025-11-17T10:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "title": "Judul artikel harus diisi",
    "content": "Konten artikel minimal 100 karakter"
  }
}
```

---

#### 4. Update Post

Mengupdate blog post yang sudah ada.

**Endpoint:**
```
PUT /posts/{id}
```

**Access:** Admin, Author

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Post UUID |

**Request Body:**
```json
{
  "title": "Panduan Lengkap Belajar React untuk Pemula (Updated)",
  "content": "Updated content...",
  "status": "published",
  "tags": ["React", "JavaScript", "Frontend"]
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Blog post updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Panduan Lengkap Belajar React untuk Pemula (Updated)",
    "slug": "panduan-lengkap-belajar-react-untuk-pemula-updated",
    "updated_at": "2025-11-17T11:00:00Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": "error",
  "message": "You are not authorized to update this post"
}
```

---

#### 5. Delete Post

Menghapus blog post (soft delete).

**Endpoint:**
```
DELETE /posts/{id}
```

**Access:** Admin, Author

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Post UUID |

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Blog post deleted successfully"
}
```

---

#### 6. Get Featured Posts

Mendapatkan daftar artikel featured.

**Endpoint:**
```
GET /posts/featured
```

**Access:** Public

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | integer | No | Jumlah posts (default: 5, max: 20) |

**Example Request:**
```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/featured?limit=5"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Featured posts retrieved successfully",
  "data": [
    {
      "id": "post-uuid-1",
      "title": "Cara Menjadi Full-Stack Developer di 2025",
      "slug": "cara-menjadi-full-stack-developer-2025",
      "excerpt": "Panduan lengkap roadmap...",
      "featured_image_url": "https://cdn.fullstacktalent.id/images/fullstack.jpg",
      "reading_time_minutes": 10,
      "views_count": 5234,
      "published_at": "2025-11-16T10:00:00Z",
      "author_name": "John Doe",
      "category_name": "Career Guide"
    }
  ]
}
```

---

#### 7. Get Popular Posts

Mendapatkan daftar artikel populer berdasarkan views.

**Endpoint:**
```
GET /posts/popular
```

**Access:** Public

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | integer | No | Jumlah posts (default: 5, max: 20) |

**Example Request:**
```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/popular?limit=5"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Popular posts retrieved successfully",
  "data": [
    {
      "id": "post-uuid-1",
      "title": "Tutorial JavaScript Modern untuk Pemula",
      "slug": "tutorial-javascript-modern-pemula",
      "featured_image_url": "https://cdn.fullstacktalent.id/images/js.jpg",
      "views_count": 8456,
      "published_at": "2025-11-10T10:00:00Z"
    }
  ]
}
```

---

### Categories

#### 8. Get All Categories

Mendapatkan semua kategori blog dengan jumlah posts.

**Endpoint:**
```
GET /categories
```

**Access:** Public

**Example Request:**
```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/categories"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-uuid-1",
      "name": "Web Development",
      "slug": "web-development",
      "description": "Artikel tentang web development",
      "icon_url": "https://cdn.fullstacktalent.id/icons/web.svg",
      "posts_count": 45,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "category-uuid-2",
      "name": "Mobile Development",
      "slug": "mobile-development",
      "description": "Artikel tentang mobile development",
      "icon_url": "https://cdn.fullstacktalent.id/icons/mobile.svg",
      "posts_count": 32,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Comments

#### 9. Add Comment

Menambahkan komentar pada blog post.

**Endpoint:**
```
POST /posts/{post_id}/comments
```

**Access:** Authenticated Users

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| post_id | string | Yes | Post UUID |

**Request Body:**
```json
{
  "content": "Artikel yang sangat membantu! Terima kasih atas panduannya.",
  "parent_id": null
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes | Isi komentar (3-1000 karakter) |
| parent_id | string | No | UUID komentar parent untuk reply |

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Comment added successfully",
  "data": {
    "id": "comment-uuid",
    "post_id": "post-uuid",
    "user_id": "user-uuid",
    "parent_id": null,
    "content": "Artikel yang sangat membantu! Terima kasih atas panduannya.",
    "status": "approved",
    "likes_count": 0,
    "created_at": "2025-11-17T10:30:00Z",
    "user_name": "Jane Smith",
    "user_avatar": "https://cdn.fullstacktalent.id/avatars/jane.jpg"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": "error",
  "message": "Comments are disabled for this post"
}
```

---

### Likes

#### 10. Toggle Like

Like atau unlike sebuah blog post.

**Endpoint:**
```
POST /posts/{id}/like
```

**Access:** Authenticated Users

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Post UUID |

**Example Request:**
```bash
curl -X POST "https://api.fullstacktalent.id/api/blog/posts/550e8400-e29b-41d4-a716-446655440000/like" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200 OK) - Liked:**
```json
{
  "status": "success",
  "message": "Post liked",
  "data": {
    "liked": true,
    "likes_count": 235
  }
}
```

**Success Response (200 OK) - Unliked:**
```json
{
  "status": "success",
  "message": "Post unliked",
  "data": {
    "liked": false,
    "likes_count": 234
  }
}
```

---

## Data Models

### BlogPost Model

```json
{
  "id": "string (UUID)",
  "author_id": "string (UUID)",
  "category_id": "string (UUID) | null",
  "title": "string (10-255 chars)",
  "slug": "string (unique)",
  "excerpt": "string | null",
  "content": "string (HTML)",
  "featured_image_url": "string (URL) | null",
  "status": "enum: draft, published, archived",
  "visibility": "enum: public, members_only, private",
  "reading_time_minutes": "integer | null",
  "views_count": "integer",
  "likes_count": "integer",
  "comments_count": "integer",
  "is_featured": "boolean",
  "allow_comments": "boolean",
  "meta_title": "string | null",
  "meta_description": "string | null",
  "published_at": "datetime | null",
  "created_at": "datetime",
  "updated_at": "datetime",
  "deleted_at": "datetime | null"
}
```

### Category Model

```json
{
  "id": "string (UUID)",
  "name": "string (3-100 chars)",
  "slug": "string (unique)",
  "description": "string | null",
  "icon_url": "string (URL) | null",
  "image_url": "string (URL) | null",
  "parent_id": "string (UUID) | null",
  "display_order": "integer",
  "posts_count": "integer",
  "is_active": "boolean",
  "meta_title": "string | null",
  "meta_description": "string | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Comment Model

```json
{
  "id": "string (UUID)",
  "post_id": "string (UUID)",
  "user_id": "string (UUID)",
  "parent_id": "string (UUID) | null",
  "content": "string (3-1000 chars)",
  "status": "enum: pending, approved, rejected, spam",
  "likes_count": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "deleted_at": "datetime | null"
}
```

### Tag Model

```json
{
  "id": "string (UUID)",
  "name": "string (max 50 chars)",
  "slug": "string (unique)",
  "posts_count": "integer",
  "created_at": "datetime"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Validasi gagal |
| 401 | Unauthorized - Token tidak valid/kadaluarsa |
| 403 | Forbidden - Tidak memiliki akses |
| 404 | Not Found - Resource tidak ditemukan |
| 422 | Unprocessable Entity - Data tidak valid |
| 500 | Internal Server Error - Server error |

---

## Error Handling

### Standard Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": {
    "field_name": "Error message for this field"
  }
}
```

### Common Errors

**Validation Error (400):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "title": "Judul artikel harus diisi",
    "content": "Konten artikel minimal 100 karakter"
  }
}
```

**Unauthorized (401):**
```json
{
  "status": "error",
  "message": "Unauthorized access",
  "error": "Token is invalid or expired"
}
```

**Forbidden (403):**
```json
{
  "status": "error",
  "message": "You are not authorized to update this post"
}
```

**Not Found (404):**
```json
{
  "status": "error",
  "message": "Blog post not found"
}
```

**Server Error (500):**
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Examples

### Complete Flow: Create and Publish Article

#### Step 1: Login dan dapatkan token

```bash
curl -X POST "https://api.fullstacktalent.id/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Step 2: Get categories untuk memilih category

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/categories"
```

#### Step 3: Create draft article

```bash
curl -X POST "https://api.fullstacktalent.id/api/blog/posts" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 Tips Menjadi Full-Stack Developer Handal",
    "content": "<h2>Pendahuluan</h2><p>Menjadi full-stack developer...</p>",
    "category_id": "category-uuid",
    "excerpt": "Panduan praktis untuk menjadi full-stack developer...",
    "status": "draft",
    "tags": ["Full-Stack", "Career", "Web Development"]
  }'
```

#### Step 4: Upload featured image (using separate upload endpoint)

```bash
curl -X POST "https://api.fullstacktalent.id/api/upload/image" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "image=@/path/to/image.jpg"
```

Response:
```json
{
  "url": "https://cdn.fullstacktalent.id/images/fullstack-tips.jpg"
}
```

#### Step 5: Update article dengan image dan publish

```bash
curl -X PUT "https://api.fullstacktalent.id/api/blog/posts/post-uuid" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "featured_image_url": "https://cdn.fullstacktalent.id/images/fullstack-tips.jpg",
    "status": "published",
    "is_featured": true
  }'
```

#### Step 6: View published article

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/10-tips-menjadi-full-stack-developer-handal"
```

---

### Example: User Interaction Flow

#### Like an article

```bash
curl -X POST "https://api.fullstacktalent.id/api/blog/posts/post-uuid/like" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Add a comment

```bash
curl -X POST "https://api.fullstacktalent.id/api/blog/posts/post-uuid/comments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artikel yang sangat bermanfaat! Saya sudah praktikkan tips nomor 3 dan hasilnya luar biasa."
  }'
```

#### Reply to a comment

```bash
curl -X POST "https://api.fullstacktalent.id/api/blog/posts/post-uuid/comments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Terima kasih atas feedbacknya! Senang bisa membantu.",
    "parent_id": "original-comment-uuid"
  }'
```

---

### Example: Search and Filter

#### Search articles by keyword

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts?search=react%20hooks&page=1"
```

#### Filter by category

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts?category_id=web-dev-uuid&per_page=20"
```

#### Get featured articles

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/featured?limit=5"
```

#### Get popular articles

```bash
curl -X GET "https://api.fullstacktalent.id/api/blog/posts/popular?limit=10"
```

---

## Best Practices

### 1. **Pagination**
- Selalu gunakan pagination untuk list endpoints
- Default `per_page` adalah 10, maksimal 50
- Gunakan `page` parameter untuk navigasi

### 2. **Caching**
- Cache response untuk artikel published (TTL: 5 menit)
- Invalidate cache saat artikel di-update/delete
- Cache kategori dan popular posts (TTL: 1 jam)

### 3. **Rate Limiting**
- Public endpoints: 100 request/menit
- Authenticated endpoints: 300 request/menit
- Write operations (POST/PUT/DELETE): 60 request/menit

### 4. **Image Optimization**
- Maksimal ukuran file: 5MB
- Format yang didukung: JPG, PNG, WebP
- Automatic resize untuk thumbnail
- CDN untuk delivery

### 5. **SEO Optimization**
- Selalu isi `meta_title` dan `meta_description`
- Gunakan slug yang SEO-friendly
- Struktur content dengan heading tags (H1, H2, H3)

### 6. **Security**
- Sanitize HTML content untuk XSS prevention
- Validate dan sanitize user input
- Rate limiting untuk prevent spam
- CSRF protection untuk authenticated requests

### 7. **Content Guidelines**
- Minimum content length: 100 characters
- Maximum title length: 255 characters
- Reading time auto-calculated (200 words/minute)
- Auto-generated excerpt dari content jika kosong

---

## Support

Untuk pertanyaan atau bantuan:

- **Email**: support@fullstacktalent.id
- **Documentation**: https://docs.fullstacktalent.id
- **GitHub**: https://github.com/fullstacktalent/api

---

## Changelog

### v1.0.0 (2025-11-17)
- ✅ Initial release
- ✅ CRUD operations untuk posts
- ✅ Category management
- ✅ Comment system
- ✅ Like functionality
- ✅ Tag system
- ✅ Search & filtering
- ✅ Pagination

---

**Last Updated**: November 17, 2025  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0