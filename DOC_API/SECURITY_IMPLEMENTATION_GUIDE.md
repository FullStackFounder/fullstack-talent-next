# Security Implementation Guide - Fullstack Talent Backend

## Overview

This guide covers all security implementations for the Fullstack Talent backend API built with CodeIgniter 4.

## Table of Contents

1. [Rate Limiting](#rate-limiting)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [SQL Injection Prevention](#sql-injection-prevention)
4. [XSS Protection](#xss-protection)
5. [CSRF Protection](#csrf-protection)
6. [File Upload Security](#file-upload-security)
7. [Security Headers](#security-headers)
8. [Best Practices](#best-practices)

---

## 1. Rate Limiting

### Configuration

Rate limiting is configured per route in `app/Config/Filters.php`:

```php
public array $filters = [
    'ratelimit:auth' => [
        'before' => ['api/auth/login', 'api/auth/register']
    ],
    'ratelimit:payment' => [
        'before' => ['api/payments/*']
    ],
];
```

### Available Rate Limit Types

- `default`: 60 requests per minute
- `auth`: 5 requests per minute (login attempts)
- `api`: 100 requests per minute
- `upload`: 10 requests per minute
- `payment`: 3 requests per minute

### Response Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1635789600
```

### Example: Custom Rate Limit

```php
// In your controller
public function sensitiveOperation()
{
    $rateLimit = service('rateLimitFilter');
    if (!$rateLimit->check('custom_operation', 10, 60)) {
        return $this->fail('Rate limit exceeded', 429);
    }
    
    // Your code here
}
```

---

## 2. Input Validation & Sanitization

### Automatic Sanitization

All input is automatically sanitized through `SanitizeInputFilter`. This removes:
- Null bytes
- Control characters
- Excessive whitespace

### Custom Validation Rules

Available in `app/Validation/SecurityRules.php`:

#### Strong Password

```php
$validation->setRules([
    'password' => 'required|strong_password'
]);
```

Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### SQL Injection Check

```php
$validation->setRules([
    'search' => 'required|no_sql_injection'
]);
```

#### XSS Check

```php
$validation->setRules([
    'content' => 'required|no_xss'
]);
```

#### Indonesian Phone Number

```php
$validation->setRules([
    'phone' => 'required|valid_indonesian_phone'
]);
```

#### File Extension

```php
$validation->setRules([
    'filename' => 'required|allowed_file_extension[jpg,png,pdf]'
]);
```

### Complete Example

```php
use App\Controllers\BaseController;

class UserController extends BaseController
{
    public function register()
    {
        $validation = \Config\Services::validation();
        
        $validation->setRules([
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|strong_password',
            'phone'    => 'required|valid_indonesian_phone',
            'name'     => 'required|no_xss|min_length[3]|max_length[100]',
        ]);
        
        if (!$validation->withRequest($this->request)->run()) {
            return $this->fail($validation->getErrors());
        }
        
        // Safe to proceed
        $data = $this->request->getPost();
        // ...
    }
}
```

---

## 3. SQL Injection Prevention

### Use Query Builder (Recommended)

```php
// SAFE - Using Query Builder
$db = \Config\Database::connect();
$builder = $db->table('users');

$users = $builder->where('email', $email)
                 ->where('status', 'active')
                 ->get()
                 ->getResultArray();
```

### Use Helper Functions

```php
helper('database');

// Safe insert
$userId = safe_insert('users', [
    'email' => $email,
    'name' => $name,
    'password' => hash_password($password)
]);

// Safe update
safe_update('users', 
    ['status' => 'active'],
    ['id' => $userId]
);

// Safe delete
safe_delete('users', ['id' => $userId]);

// Safe LIKE search
$builder = $db->table('courses');
safe_like_search($builder, 'title', $searchTerm, 'both');
$results = $builder->get()->getResultArray();

// Safe pagination
$builder = $db->table('courses');
safe_pagination($builder, $page, $perPage);
$results = $builder->get()->getResultArray();
```

### Validate Dynamic Parameters

```php
helper('database');

// Validate ORDER BY
$orderParams = validate_order_by($request->getGet('sort'), $request->getGet('direction'));
if ($orderParams) {
    $builder->orderBy($orderParams['column'], $orderParams['direction']);
}

// Sanitize table name
$tableName = sanitize_table_name($request->getGet('table'));
if ($tableName) {
    $builder = $db->table($tableName);
}

// Sanitize column name
$columnName = sanitize_column_name($request->getGet('field'));
if ($columnName) {
    $builder->select($columnName);
}
```

### NEVER Do This

```php
// DANGEROUS - Direct SQL with user input
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";
$db->query($sql);

// DANGEROUS - String concatenation
$sql = "SELECT * FROM " . $tableName . " WHERE id = " . $id;
```

---

## 4. XSS Protection

### Output Encoding

```php
helper('security');

// In views or API responses
<?= safe_output($userInput) ?>

// For URLs
<a href="<?= safe_url($userUrl) ?>">Link</a>

// For HTML content (with allowed tags)
<?= safe_html($content, ['p', 'strong', 'em', 'a']) ?>
```

### Input Cleaning

```php
helper('security');

// Clean potentially malicious input
$cleanData = xss_clean($userInput);

// Clean array of data
$cleanArray = xss_clean($_POST);
```

### Content Security Policy

Configured in `app/Config/Security.php`:

```php
public array $CSP = [
    'default-src' => ['self'],
    'script-src'  => ['self', 'unsafe-inline'],
    'style-src'   => ['self', 'unsafe-inline'],
    'img-src'     => ['self', 'data:', 'https:'],
];
```

### Example Controller

```php
class BlogController extends BaseController
{
    public function createPost()
    {
        helper('security');
        
        $title = xss_clean($this->request->getPost('title'));
        $content = safe_html($this->request->getPost('content'));
        
        $postModel->insert([
            'title' => $title,
            'content' => $content,
            'author_id' => session('user_id')
        ]);
        
        return $this->respondCreated([
            'title' => safe_output($title)
        ]);
    }
    
    public function getPost($id)
    {
        $post = $postModel->find($id);
        
        return $this->respond([
            'title' => safe_output($post['title']),
            'content' => safe_html($post['content']),
            'author' => safe_output($post['author_name'])
        ]);
    }
}
```

---

## 5. CSRF Protection

### Configuration

In `app/Config/Security.php`:

```php
public string $csrfProtection = 'session';
public string $tokenName = 'csrf_token';
public int $expires = 7200; // 2 hours
public bool $regenerate = true;
```

### In HTML Forms

```php
<form method="POST" action="/api/submit">
    <?= csrf_field() ?>
    
    <input type="text" name="data">
    <button type="submit">Submit</button>
</form>
```

### In AJAX Requests

```html
<!-- Add meta tag in header -->
<?= csrf_meta() ?>

<script>
// Get token from meta tag
const token = document.querySelector('meta[name="csrf-token"]').content;

// Use in AJAX
fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
    },
    body: JSON.stringify(data)
});

// Or with jQuery
$.ajax({
    url: '/api/endpoint',
    type: 'POST',
    headers: {
        'X-CSRF-TOKEN': token
    },
    data: data
});
</script>
```

### Manual Verification

```php
helper('security');

$token = $this->request->getHeaderLine('X-CSRF-TOKEN');
if (!verify_csrf_token($token)) {
    return $this->fail('CSRF token verification failed', 403);
}
```

### Excluding Routes from CSRF

In `app/Config/Filters.php`:

```php
public array $globals = [
    'before' => [
        'csrf' => [
            'except' => [
                'api/webhook/*',
                'payment/callback/*'
            ]
        ],
    ],
];
```

---

## 6. File Upload Security

### Basic Usage

```php
use App\Libraries\SecureFileUpload;

class UploadController extends BaseController
{
    public function uploadImage()
    {
        $uploader = new SecureFileUpload();
        
        $file = $this->request->getFile('image');
        
        $result = $uploader->upload($file, 'image', [
            'scan_malware' => true,
            'create_thumbnail' => true,
            'directory' => 'profiles'
        ]);
        
        if (!$result['success']) {
            return $this->fail($result['message']);
        }
        
        return $this->respond([
            'url' => $uploader->getFileUrl($result['data']['filepath']),
            'file_info' => $result['data']
        ]);
    }
}
```

### Upload Categories

- `image`: Max 5MB, allowed: jpg, png, gif, webp, svg
- `document`: Max 10MB, allowed: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv
- `video`: Max 100MB, allowed: mp4, mpeg, mov, avi, webm
- `audio`: Max 10MB, allowed: mp3, wav, ogg, webm
- `archive`: Max 50MB, allowed: zip, rar, 7z

### Custom Configuration

```php
$uploader = new SecureFileUpload();

// Set custom upload path
$uploader->setUploadPath(WRITEPATH . 'custom/path/');

// Set custom max file size
$uploader->setMaxFileSize('image', 10485760); // 10MB

// Add allowed MIME type
$uploader->addAllowedMimeType('image', 'image/avif');

// Upload with options
$result = $uploader->upload($file, 'document', [
    'preserve_name' => true,
    'scan_malware' => true,
    'directory' => 'user_' . $userId
]);
```

### Delete File

```php
$uploader = new SecureFileUpload();
$uploader->delete('profiles/file_abc123.jpg');
```

### Security Features

✅ MIME type validation (client + server-side)
✅ File extension validation
✅ File size limits
✅ Malware scanning (basic + ClamAV if available)
✅ Secure filename generation
✅ Path traversal prevention
✅ Proper file permissions
✅ Thumbnail generation for images

---

## 7. Security Headers

### Automatic Headers

All responses include security headers configured in `app/Config/Security.php`:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Set Custom Headers

```php
helper('security');

// Set all security headers
set_security_headers();

// Prevent clickjacking
prevent_clickjacking();
```

---

## 8. Best Practices

### Password Handling

```php
helper('security');

// Hash password
$hashedPassword = hash_password($plainPassword);

// Verify password
if (verify_password($plainPassword, $hashedPassword)) {
    // Login successful
}
```

### Sensitive Data Masking

```php
helper('security');

// Mask email for logging
$masked = mask_sensitive_data('user@example.com', 'email');
// Output: use***@example.com

// Mask phone number
$masked = mask_sensitive_data('08123456789', 'phone');
// Output: 08*******89

// Mask credit card
$masked = mask_sensitive_data('1234567890123456', 'card');
// Output: ************3456
```

### Email Sanitization

```php
helper('security');

$email = sanitize_email($userInput);
if ($email === false) {
    return $this->fail('Invalid email format');
}
```

### Secure Random Strings

```php
helper('security');

// Generate secure token
$token = secure_random_string(32);

// Generate CSRF token
$csrfToken = generate_csrf_token();
```

### Input Sanitization

```php
helper('security');

// Sanitize filename
$safeFilename = sanitize_filename($_FILES['upload']['name']);

// Sanitize URL
$safeUrl = safe_url($userProvidedUrl);
```

---

## Complete Example: Secure Controller

```php
<?php

namespace App\Controllers;

use App\Libraries\SecureFileUpload;
use CodeIgniter\RESTful\ResourceController;

class SecureController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format = 'json';
    
    public function __construct()
    {
        helper(['security', 'database']);
        set_security_headers();
    }
    
    public function register()
    {
        // Validate input
        $validation = \Config\Services::validation();
        $validation->setRules([
            'email'    => 'required|valid_email|no_xss|is_unique[users.email]',
            'password' => 'required|strong_password',
            'name'     => 'required|no_xss|no_sql_injection|min_length[3]',
            'phone'    => 'required|valid_indonesian_phone',
        ]);
        
        if (!$validation->withRequest($this->request)->run()) {
            return $this->fail($validation->getErrors());
        }
        
        // Clean and secure input
        $data = [
            'email'    => sanitize_email($this->request->getPost('email')),
            'password' => hash_password($this->request->getPost('password')),
            'name'     => xss_clean($this->request->getPost('name')),
            'phone'    => $this->request->getPost('phone'),
        ];
        
        // Safe database insert
        $userId = safe_insert('users', $data);
        
        if (!$userId) {
            return $this->fail('Registration failed');
        }
        
        // Generate secure token
        $token = secure_random_string(32);
        
        return $this->respondCreated([
            'user_id' => $userId,
            'token'   => $token,
            'message' => 'Registration successful'
        ]);
    }
    
    public function uploadAvatar($userId)
    {
        // Verify user authentication
        if (session('user_id') != $userId) {
            return $this->failUnauthorized();
        }
        
        // Upload file securely
        $uploader = new SecureFileUpload();
        $file = $this->request->getFile('avatar');
        
        $result = $uploader->upload($file, 'image', [
            'directory' => 'avatars',
            'create_thumbnail' => true,
            'scan_malware' => true
        ]);
        
        if (!$result['success']) {
            return $this->fail($result['message']);
        }
        
        // Update user avatar
        safe_update('users', 
            ['avatar_url' => $result['data']['filepath']],
            ['id' => $userId]
        );
        
        return $this->respond([
            'avatar_url' => $uploader->getFileUrl($result['data']['filepath']),
            'message' => 'Avatar uploaded successfully'
        ]);
    }
    
    public function search()
    {
        // Validate and sanitize search input
        $search = xss_clean($this->request->getGet('q'));
        
        if (!prevent_sql_injection($search)) {
            log_message('alert', 'SQL injection attempt: ' . mask_sensitive_data($search, 'email'));
            return $this->fail('Invalid search query');
        }
        
        // Safe database query
        $db = \Config\Database::connect();
        $builder = $db->table('users');
        
        safe_like_search($builder, 'name', $search, 'both');
        
        // Safe pagination
        $page = (int)$this->request->getGet('page') ?: 1;
        $perPage = (int)$this->request->getGet('per_page') ?: 10;
        safe_pagination($builder, $page, $perPage);
        
        $results = $builder->get()->getResultArray();
        
        // Safe output
        foreach ($results as &$result) {
            $result['name'] = safe_output($result['name']);
            $result['email'] = safe_output($result['email']);
        }
        
        return $this->respond($results);
    }
}
```

---

## Monitoring and Alerts

### Security Logging

All security events are automatically logged:

- Failed login attempts
- CSRF token failures
- SQL injection attempts
- XSS attempts
- Rate limit violations
- Suspicious file uploads

### Check Logs

```bash
# View security logs
tail -f writable/logs/log-*.log | grep -E 'alert|warning|error'

# View failed logins
grep "Failed login" writable/logs/*.log

# View SQL injection attempts
grep "SQL injection" writable/logs/*.log
```

### Email Alerts

Configure in `app/Config/Security.php`:

```php
public array $securityLogging = [
    'alert_threshold' => 10,
    'alert_email' => 'security@fullstacktalent.id',
];
```

---

## Testing Security

### Rate Limiting Test

```bash
# Test login rate limit (should block after 5 attempts)
for i in {1..10}; do
    curl -X POST http://localhost:8080/api/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"test@test.com","password":"wrong"}'
    echo ""
done
```

### SQL Injection Test

```bash
# Should be blocked
curl -X GET "http://localhost:8080/api/users?search=admin' OR '1'='1"
```

### XSS Test

```bash
# Should be sanitized
curl -X POST http://localhost:8080/api/comments \
     -H "Content-Type: application/json" \
     -d '{"comment":"<script>alert(1)</script>"}'
```

### File Upload Test

```bash
# Should be rejected (PHP file)
curl -X POST http://localhost:8080/api/upload \
     -F "file=@malicious.php"
```

---

## Checklist

- [ ] Rate limiting enabled on all sensitive endpoints
- [ ] All user input validated and sanitized
- [ ] SQL queries use prepared statements or Query Builder
- [ ] All output properly encoded
- [ ] CSRF protection enabled on all forms
- [ ] File uploads validated and scanned
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Passwords hashed with Argon2
- [ ] Sensitive data masked in logs
- [ ] Security alerts configured
- [ ] Regular security audits scheduled

---

## Support

For security issues, contact: security@fullstacktalent.id

**IMPORTANT:** Never commit sensitive configuration files to version control. Use environment variables for all secrets and API keys.