# Fullstack Talent Backend - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.1
- **Composer** >= 2.0
- **MySQL** >= 5.7 or MariaDB >= 10.3
- **Git**
- **Postman** or **cURL** (for API testing)

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/fullstacktalent/backend.git
cd backend
```

### 2. Install Dependencies

```bash
composer install
```

If you encounter errors, try:
```bash
composer update
```

### 3. Install JWT Library

```bash
composer require firebase/php-jwt
```

### 4. Database Setup

#### Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE fullstacktalentDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Import Database Schema
```bash
mysql -u root -p fullstacktalentDB < database/fullstacktalentDB.sql
```

Or use the SQL file provided in your project documents.

### 5. Environment Configuration

#### Copy .env file
```bash
cp .env.example .env
```

#### Update .env Configuration

Open `.env` and update the following:

**Database Configuration:**
```env
database.default.hostname = localhost
database.default.database = fullstacktalentDB
database.default.username = root
database.default.password = your_mysql_password
database.default.DBDriver = MySQLi
database.default.port = 3306
```

**JWT Configuration:**
```env
# Generate a secure key: 
# php -r "echo bin2hex(random_bytes(32));"
jwt.key = 'your-generated-secure-jwt-key-here'
jwt.algorithm = 'HS256'
jwt.expiration = 86400
```

**Email Configuration (Gmail):**
```env
email.fromEmail = 'noreply@fullstacktalent.id'
email.fromName = 'Fullstack Talent'
email.SMTPHost = 'smtp.gmail.com'
email.SMTPUser = 'your-email@gmail.com'
email.SMTPPass = 'your-app-password'
email.SMTPPort = 587
email.SMTPCrypto = 'tls'
```

**To get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate new password
4. Use generated password in `.env`

**Email Configuration (Mailtrap - for Development):**
```env
email.SMTPHost = 'smtp.mailtrap.io'
email.SMTPUser = 'your-mailtrap-username'
email.SMTPPass = 'your-mailtrap-password'
email.SMTPPort = 2525
```

### 6. Configure Autoload

Update `app/Config/Autoload.php` to include helpers:

```php
public $helpers = ['response'];
```

### 7. Set File Permissions

```bash
# Linux/Mac
chmod -R 755 writable/
chmod -R 755 public/uploads/

# Create uploads directory if not exists
mkdir -p public/uploads
```

### 8. Generate JWT Secret Key

```bash
php -r "echo bin2hex(random_bytes(32)) . PHP_EOL;"
```

Copy the output and update `jwt.key` in `.env` file.

---

## 🚀 Running the Application

### Development Server

```bash
php spark serve
```

The application will be available at: `http://localhost:8080`

### Run on Custom Port

```bash
php spark serve --port=8000
```

---

## 🧪 Testing the API

### Option 1: Using cURL

#### 1. Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "08123456789",
    "role": "siswa"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `access_token` from response.

#### 3. Get Profile
```bash
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Option 2: Using Postman

#### Import Collection

1. Open Postman
2. Click "Import" → "Raw Text"
3. Use the requests from `API_DOCUMENTATION.md`

#### Create Environment

1. Click "Environments" → "Create Environment"
2. Add variables:
   - `base_url`: `http://localhost:8080/api`
   - `access_token`: (will be set after login)

#### Test Flow

1. **Register** → `POST {{base_url}}/auth/register`
2. **Login** → `POST {{base_url}}/auth/login`
   - Copy `access_token` from response
   - Set it in Environment variables
3. **Get Profile** → `GET {{base_url}}/auth/profile`
   - Add Header: `Authorization: Bearer {{access_token}}`

---

## 📝 Database Seeding (Optional)

Create sample data for testing:

```bash
php spark db:seed TestUserSeeder
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Class 'Firebase\JWT\JWT' not found"
**Solution:**
```bash
composer require firebase/php-jwt
composer dump-autoload
```

#### 2. Database Connection Error
**Solution:**
- Verify MySQL is running: `sudo service mysql status`
- Check credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

#### 3. Email Not Sending
**Solution:**
- Check email credentials in `.env`
- For Gmail: Enable "Less secure app access" or use App Password
- For development: Use Mailtrap.io

#### 4. CORS Error
**Solution:**
- Ensure `CorsFilter` is in `app/Config/Filters.php`
- Check filter is applied globally in filters config

#### 5. Token Invalid Error
**Solution:**
- Verify `jwt.key` is set in `.env`
- Regenerate JWT secret key
- Check token expiration settings

#### 6. Writable Directory Not Writable
**Solution:**
```bash
chmod -R 755 writable/
sudo chown -R www-data:www-data writable/
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `jwt.key` to a strong random value
- [ ] Update database credentials
- [ ] Set `CI_ENVIRONMENT = production` in `.env`
- [ ] Enable HTTPS
- [ ] Configure email service (not Gmail for production)
- [ ] Set up proper error logging
- [ ] Implement rate limiting
- [ ] Review CORS settings
- [ ] Disable debug toolbar
- [ ] Set secure session cookies

---

## 📊 Verify Installation

Run this checklist to verify everything is working:

```bash
# Check PHP version
php -v

# Check Composer version
composer --version

# Check MySQL connection
mysql -u root -p -e "SELECT VERSION();"

# Check CodeIgniter installation
php spark list

# Test API endpoint
curl http://localhost:8080/api/auth/register -I
```

Expected output: HTTP/1.1 200 OK or 400/422 (validation error is OK)

---

## 📚 Next Steps

After successful installation:

1. **Read API Documentation**: `API_DOCUMENTATION.md`
2. **Test All Endpoints**: Use Postman collection
3. **Review Code Structure**: Understand MVC architecture
4. **Check Logs**: `writable/logs/` for debugging
5. **Start Building**: Add more features!

---

## 🐛 Debugging Tips

### Enable Debug Mode

In `.env`:
```env
CI_ENVIRONMENT = development
```

### View Logs

```bash
tail -f writable/logs/log-2025-11-01.log
```

### Common Log Locations

- **Application Logs**: `writable/logs/`
- **Email Logs**: Database table `email_logs`
- **Error Logs**: `writable/logs/log-*.log`

---

## 📞 Support

If you encounter issues:

1. Check logs in `writable/logs/`
2. Review documentation
3. Search existing issues on GitHub
4. Contact: support@fullstacktalent.id

---

## 📄 License

This project is licensed under MIT License.

---

**Happy Coding! 🚀**