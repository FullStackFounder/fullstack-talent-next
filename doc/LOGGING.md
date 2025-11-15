# Logging & Monitoring System Documentation

## Overview
Sistem logging dan monitoring komprehensif untuk Fullstack Talent Platform yang mencakup activity logs, error tracking, API logs, performance metrics, dan security audit logs.

## Architecture

### 1. Models

#### ActivityLogModel
Mencatat semua aktivitas user di platform.

**Fitur:**
- Track user activities
- Device dan browser information
- Geographic information (country, city)
- Duration tracking
- Activity statistics dan analytics

**Methods:**
- `logActivity($data)` - Log user activity
- `getActivitiesByUser($userId, $limit, $offset)` - Get activities by user
- `getActivitiesByType($activityType, $limit, $offset)` - Get activities by type
- `getActivityStats($period)` - Get activity statistics
- `getTopActiveUsers($limit, $period)` - Get most active users
- `cleanOldLogs($days)` - Clean old activity logs

#### ErrorLogModel
Tracking dan management error di aplikasi.

**Fitur:**
- Error occurrence counting
- Severity levels (low, medium, high, critical)
- Error resolution tracking
- Error trend analysis
- Duplicate error detection

**Methods:**
- `logError($errorData)` - Log error (auto-detect duplicates)
- `getErrorsBySeverity($severity, $limit, $offset)` - Get errors by severity
- `getUnresolvedErrors($limit, $offset)` - Get unresolved errors
- `getCriticalErrors($limit)` - Get critical errors
- `resolveError($errorId, $resolvedBy, $notes)` - Mark error as resolved
- `getErrorStats($period)` - Get error statistics
- `getMostCommonErrors($period, $limit)` - Get most common errors
- `getErrorTrend($days)` - Get error trend over time

#### ApiLogModel
Logging untuk semua API requests dan responses.

**Fitur:**
- Request/response logging
- Performance metrics
- Sensitive data sanitization
- API usage analytics
- Response time tracking

**Methods:**
- `logRequest($data)` - Log API request
- `getLogsByEndpoint($endpoint, $limit, $offset)` - Get logs by endpoint
- `getLogsByUser($userId, $limit, $offset)` - Get logs by user
- `getFailedRequests($limit, $offset)` - Get failed requests
- `getSlowRequests($thresholdMs, $limit)` - Get slow requests
- `getApiStats($period)` - Get API statistics
- `getPerformanceMetrics($period)` - Get performance metrics
- `getApiUsageByUser($period, $limit)` - Get API usage by user

#### AuditLogModel
Security audit trail untuk compliance dan tracking.

**Fitur:**
- Complete audit trail
- Entity change tracking
- Security events logging
- Compliance ready
- JSON metadata support

**Methods:**
- `logAudit($data)` - Log audit trail
- `getAuditsByUser($userId, $limit, $offset)` - Get audits by user
- `getAuditsByEntity($entityType, $entityId, $limit)` - Get audits by entity
- `getAuditsByAction($action, $limit, $offset)` - Get audits by action
- `getSecurityEvents($limit, $offset)` - Get security events
- `getFailedLoginAttempts($period, $limit)` - Get failed login attempts
- `getSuspiciousActivities($limit, $offset)` - Get suspicious activities
- `getUserActivityTimeline($userId, $limit)` - Get user activity timeline

### 2. Filters

#### ActivityLogFilter
Automatically logs all user activities.

**Usage:**
```php
// In Config/Filters.php
public array $globals = [
    'after' => ['activityLog']
];
```

**Features:**
- Auto-track page views
- Device and browser detection
- Duration calculation
- Skip certain paths (assets, health checks)

#### ApiLogFilter
Automatically logs all API requests.

**Usage:**
```php
// In Config/Filters.php
public array $filters = [
    'apiLog' => ['before' => ['api/*'], 'after' => ['api/*']]
];
```

**Features:**
- Request/response logging
- Sensitive data sanitization
- Performance tracking
- Error message capture

### 3. Services

#### LoggingService
Centralized logging service untuk consistency.

**Methods:**

```php
// Activity Logging
$loggingService->logActivity($activityType, $description, $additionalData);

// Error Logging
$loggingService->logError($errorType, $errorMessage, $stackTrace, $severity);

// API Logging
$loggingService->logApiRequest($requestData, $responseData);

// Audit Logging
$loggingService->logAudit($action, $entityType, $entityId, $details, $metadata);

// Authentication Events
$loggingService->logAuthEvent($event, $userId, $success, $reason);

// Data Modifications
$loggingService->logDataModification($action, $entityType, $entityId, $oldData, $newData);

// Security Events
$loggingService->logSecurityEvent($event, $severity, $description, $details);

// Exception Logging
$loggingService->logException($exception, $severity);

// Statistics
$stats = $loggingService->getAllLogStats($period);

// Cleanup
$result = $loggingService->cleanOldLogs($config);

// Export
$filepath = $loggingService->exportLogs($type, $format, $filters);
```

### 4. Controllers

#### MonitoringController
Admin dashboard untuk monitoring dan analytics.

**Endpoints:**

```
GET  /admin/monitoring/dashboard           - Dashboard overview
GET  /admin/monitoring/activities          - Activity logs
GET  /admin/monitoring/errors              - Error logs
GET  /admin/monitoring/api-logs            - API logs
GET  /admin/monitoring/audits              - Audit logs
POST /admin/monitoring/errors/{id}/resolve - Resolve error
GET  /admin/monitoring/performance         - Performance metrics
GET  /admin/monitoring/security            - Security events
GET  /admin/monitoring/export              - Export logs
POST /admin/monitoring/clean-logs          - Clean old logs
GET  /admin/monitoring/statistics          - Get statistics
```

## Configuration

### 1. Setup Filters

Edit `app/Config/Filters.php`:

```php
<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
    public array $aliases = [
        'activityLog' => \App\Filters\ActivityLogFilter::class,
        'apiLog' => \App\Filters\ApiLogFilter::class,
    ];

    public array $globals = [
        'before' => [],
        'after' => [
            'activityLog' // Enable global activity logging
        ]
    ];

    public array $filters = [
        'apiLog' => [
            'before' => ['api/*'],
            'after' => ['api/*']
        ]
    ];
}
```

### 2. Setup Routes

Edit `app/Config/Routes.php`:

```php
// Admin Monitoring Routes
$routes->group('admin/monitoring', ['filter' => 'auth:admin'], function($routes) {
    $routes->get('dashboard', 'Admin\MonitoringController::dashboard');
    $routes->get('activities', 'Admin\MonitoringController::activities');
    $routes->get('errors', 'Admin\MonitoringController::errors');
    $routes->get('api-logs', 'Admin\MonitoringController::apiLogs');
    $routes->get('audits', 'Admin\MonitoringController::audits');
    $routes->post('errors/(:segment)/resolve', 'Admin\MonitoringController::resolveError/$1');
    $routes->get('performance', 'Admin\MonitoringController::performance');
    $routes->get('security', 'Admin\MonitoringController::security');
    $routes->get('export', 'Admin\MonitoringController::export');
    $routes->post('clean-logs', 'Admin\MonitoringController::cleanLogs');
    $routes->get('statistics', 'Admin\MonitoringController::statistics');
});
```

## Usage Examples

### 1. Manual Activity Logging

```php
use App\Services\LoggingService;

$loggingService = new LoggingService();

// Log user login
$loggingService->logActivity('login', 'User logged in successfully');

// Log course enrollment
$loggingService->logActivity(
    'course_enrollment', 
    'Enrolled in: ' . $courseName,
    ['course_id' => $courseId]
);
```

### 2. Error Logging

```php
try {
    // Your code
} catch (\Exception $e) {
    $loggingService->logException($e, 'high');
    
    // Or manually
    $loggingService->logError(
        'PaymentError',
        'Payment processing failed',
        $e->getTraceAsString(),
        'critical',
        ['payment_id' => $paymentId]
    );
}
```

### 3. Audit Logging

```php
// Log data modification
$loggingService->logDataModification(
    'update',
    'course',
    $courseId,
    $oldData,
    $newData
);

// Log permission change
$loggingService->logAudit(
    'permission_granted',
    'user',
    $userId,
    ['permission' => 'admin_access']
);
```

### 4. Security Logging

```php
// Log failed login
$loggingService->logAuthEvent(
    'login_failed',
    $userId,
    false,
    'Invalid password'
);

// Log suspicious activity
$loggingService->logSecurityEvent(
    'multiple_failed_logins',
    'high',
    'User attempted login 5 times in 1 minute',
    ['attempts' => 5, 'timeframe' => '60s']
);
```

### 5. Querying Logs

```php
// Get activity statistics
$activityModel = new ActivityLogModel();
$stats = $activityModel->getActivityStats('month');

// Get unresolved errors
$errorModel = new ErrorLogModel();
$errors = $errorModel->getUnresolvedErrors(50);

// Get slow API requests
$apiLogModel = new ApiLogModel();
$slowRequests = $apiLogModel->getSlowRequests(1000, 20); // > 1 second

// Get security events
$auditModel = new AuditLogModel();
$securityEvents = $auditModel->getSecurityEvents(50);
```

## Performance Considerations

### 1. Asynchronous Logging
Logging dilakukan secara non-blocking untuk tidak mengganggu performance aplikasi:

```php
try {
    $this->activityLogModel->logActivity($data);
} catch (\Exception $e) {
    // Silent fail - don't break the application
    log_message('error', 'Activity log failed: ' . $e->getMessage());
}
```

### 2. Data Sanitization
Sensitive data otomatis diredact:
- Passwords
- API keys
- Tokens
- Credit card numbers
- Authorization headers

### 3. Log Rotation
Implement automatic log cleanup:

```php
// Run via cron job
$loggingService->cleanOldLogs([
    'activity_days' => 90,    // Keep activity logs for 90 days
    'error_days' => 90,       // Keep error logs for 90 days
    'api_days' => 90,         // Keep API logs for 90 days
    'audit_days' => 365       // Keep audit logs for 1 year (compliance)
]);
```

### 4. Database Indexing
Pastikan database memiliki index yang optimal:
- Index pada `user_id`, `created_at`
- Index pada `activity_type`, `error_type`
- Composite index untuk query yang sering

## Best Practices

### 1. Consistent Logging
```php
// ✅ Good - Consistent format
$loggingService->logActivity('course_create', 'Created course: ' . $title);

// ❌ Bad - Inconsistent format
$loggingService->logActivity('create', 'course created');
```

### 2. Appropriate Severity Levels
```php
// ✅ Good - Appropriate severity
$loggingService->logError('ValidationError', $message, null, 'low');
$loggingService->logError('DatabaseError', $message, $trace, 'critical');

// ❌ Bad - Everything is critical
$loggingService->logError('MinorIssue', $message, null, 'critical');
```

### 3. Meaningful Descriptions
```php
// ✅ Good - Clear and informative
$loggingService->logAudit(
    'permission_granted',
    'user',
    $userId,
    ['permission' => 'course_management', 'granted_by' => $adminId]
);

// ❌ Bad - Vague description
$loggingService->logAudit('update', 'user', $userId);
```

### 4. Don't Over-Log
```php
// ✅ Good - Log important events
$loggingService->logActivity('payment_completed', 'Payment successful');

// ❌ Bad - Logging every trivial action
$loggingService->logActivity('mouse_moved', 'User moved mouse');
```

## Monitoring Dashboard

### Key Metrics to Monitor:

1. **Activity Metrics**
   - Total activities per day/week/month
   - Unique active users
   - Peak usage times
   - Activity breakdown by type

2. **Error Metrics**
   - Total errors by severity
   - Unresolved errors count
   - Most common errors
   - Error trend over time
   - Mean time to resolution (MTTR)

3. **API Metrics**
   - Total requests
   - Success rate
   - Average response time
   - Slow requests (> 1s)
   - Failed requests
   - Most used endpoints

4. **Security Metrics**
   - Failed login attempts
   - Suspicious activities
   - Security events
   - Permission denials

## Alerts & Notifications

Implement alerting system untuk critical events:

```php
// Example: Alert on critical errors
$criticalErrors = $errorModel->getCriticalErrors(1);
if (!empty($criticalErrors)) {
    // Send notification to admin
    $this->sendAdminNotification('Critical Error Detected', $criticalErrors[0]);
}

// Example: Alert on suspicious activity
$failedLogins = $auditModel->getFailedLoginAttempts('today');
if (count($failedLogins) > 10) {
    // Send security alert
    $this->sendSecurityAlert('Multiple Failed Login Attempts', $failedLogins);
}
```

## Compliance & Data Retention

### GDPR Compliance
- Store only necessary data
- Implement data retention policies
- Provide export functionality
- Allow data deletion requests

### Retention Policies
- Activity logs: 90 days
- Error logs: 90 days
- API logs: 90 days
- Audit logs: 365 days (minimum for compliance)

### Data Export
```php
// Export logs for compliance or analysis
$filepath = $loggingService->exportLogs('audit', 'json', [
    'start_date' => '2024-01-01',
    'end_date' => '2024-12-31'
]);
```

## Troubleshooting

### High Database Load
- Implement log rotation
- Use archival strategy
- Consider separate logging database
- Implement batching for high-volume logs

### Missing Logs
- Check filter configuration
- Verify database connection
- Check permissions
- Review error logs

### Performance Impact
- Review logging frequency
- Implement sampling for high-volume endpoints
- Use asynchronous logging
- Optimize database queries

## Future Enhancements

1. **Real-time Monitoring**
   - WebSocket integration
   - Live dashboard updates
   - Real-time alerts

2. **Advanced Analytics**
   - Machine learning for anomaly detection
   - Predictive analytics
   - User behavior analysis

3. **Integration**
   - External monitoring services (Sentry, New Relic)
   - Log aggregation tools (ELK Stack, Splunk)
   - Alert integration (Slack, Email, SMS)

4. **Visualization**
   - Interactive charts and graphs
   - Custom dashboards
   - Exportable reports

---

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Maintained by:** Fullstack Talent Development Team

# Logging & Monitoring System - Quick Start Guide

## 📋 Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Quick Usage](#quick-usage)
- [API Endpoints](#api-endpoints)
- [Common Scenarios](#common-scenarios)

## 🚀 Installation

### 1. Files Structure
```
app/
├── Models/
│   ├── ActivityLogModel.php
│   ├── ErrorLogModel.php
│   ├── ApiLogModel.php
│   └── AuditLogModel.php
├── Filters/
│   ├── ActivityLogFilter.php
│   └── ApiLogFilter.php
├── Services/
│   └── LoggingService.php
└── Controllers/
    └── Admin/
        └── MonitoringController.php
```

### 2. Database Tables
All tables are already defined in `fullstacktalentDB.sql`:
- `activity_logs`
- `error_logs`
- `api_logs`
- `audit_logs`

## ⚙️ Configuration

### Step 1: Enable Filters

Edit `app/Config/Filters.php`:

```php
public array $aliases = [
    'activityLog' => \App\Filters\ActivityLogFilter::class,
    'apiLog' => \App\Filters\ApiLogFilter::class,
];

public array $globals = [
    'after' => ['activityLog'] // Enable global activity logging
];

public array $filters = [
    'apiLog' => [
        'before' => ['api/*'],
        'after' => ['api/*']
    ]
];
```

### Step 2: Add Routes

Edit `app/Config/Routes.php`:

```php
$routes->group('admin/monitoring', ['filter' => 'auth:admin'], function($routes) {
    $routes->get('dashboard', 'Admin\MonitoringController::dashboard');
    $routes->get('activities', 'Admin\MonitoringController::activities');
    $routes->get('errors', 'Admin\MonitoringController::errors');
    $routes->get('api-logs', 'Admin\MonitoringController::apiLogs');
    $routes->get('audits', 'Admin\MonitoringController::audits');
    $routes->post('errors/(:segment)/resolve', 'Admin\MonitoringController::resolveError/$1');
    $routes->get('performance', 'Admin\MonitoringController::performance');
    $routes->get('security', 'Admin\MonitoringController::security');
    $routes->get('export', 'Admin\MonitoringController::export');
    $routes->post('clean-logs', 'Admin\MonitoringController::cleanLogs');
    $routes->get('statistics', 'Admin\MonitoringController::statistics');
});
```

### Step 3: Setup Cron Job (Optional)

Add to crontab for automatic log cleanup:

```bash
# Clean old logs daily at 2 AM
0 2 * * * php /path/to/project/spark monitoring:clean-logs
```

## 🎯 Quick Usage

### 1. Automatic Logging (via Filters)

Once filters are enabled, logging happens automatically:

```php
// Activity logging - AUTOMATIC
// Every page view and action is logged automatically

// API logging - AUTOMATIC  
// All API requests are logged automatically
```

### 2. Manual Logging

```php
use App\Services\LoggingService;

$loggingService = new LoggingService();

// Log activity
$loggingService->logActivity('course_enrollment', 'User enrolled in course');

// Log error
$loggingService->logError('PaymentError', 'Payment failed', $trace, 'high');

// Log audit
$loggingService->logAudit('update', 'course', $courseId, ['title' => $newTitle]);

// Log exception
try {
    // code
} catch (\Exception $e) {
    $loggingService->logException($e);
}
```

## 📡 API Endpoints

### Dashboard Overview
```http
GET /admin/monitoring/dashboard?period=today
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "activities": {
            "total_activities": 1250,
            "unique_users": 45,
            "by_type": {...}
        },
        "errors": {
            "total_errors": 15,
            "by_severity": {...}
        },
        "api_requests": {
            "total_requests": 5340,
            "success_rate": 98.5
        }
    }
}
```

### Activity Logs
```http
GET /admin/monitoring/activities?page=1&per_page=50&user_id={userId}
```

### Error Logs
```http
GET /admin/monitoring/errors?severity=critical&status=unresolved
```

### API Logs
```http
GET /admin/monitoring/api-logs?endpoint=/api/courses&status=failed
```

### Audit Logs
```http
GET /admin/monitoring/audits?user_id={userId}&action=update
```

### Resolve Error
```http
POST /admin/monitoring/errors/{errorId}/resolve
Content-Type: application/json

{
    "notes": "Fixed by updating database schema"
}
```

### Performance Metrics
```http
GET /admin/monitoring/performance?period=week
```

### Security Events
```http
GET /admin/monitoring/security?period=today
```

### Export Logs
```http
GET /admin/monitoring/export?type=error&format=json&start_date=2024-01-01&end_date=2024-12-31
```

### Clean Old Logs
```http
POST /admin/monitoring/clean-logs
Content-Type: application/json

{
    "activity_days": 90,
    "error_days": 90,
    "api_days": 90,
    "audit_days": 365
}
```

### Get Statistics
```http
GET /admin/monitoring/statistics?period=month
```

## 📚 Common Scenarios

### Scenario 1: Track User Login
```php
use App\Services\LoggingService;

$loggingService = new LoggingService();

// Successful login
$loggingService->logAuthEvent('login_success', $userId, true);

// Failed login
$loggingService->logAuthEvent('login_failed', $userId, false, 'Invalid password');
```

### Scenario 2: Log Data Changes
```php
// Before update
$oldData = $courseModel->find($courseId);

// Update
$courseModel->update($courseId, $newData);

// After update
$newData = $courseModel->find($courseId);

// Log the change
$loggingService->logDataModification('update', 'course', $courseId, $oldData, $newData);
```

### Scenario 3: Monitor API Performance
```php
// Get slow requests
$apiLogModel = new ApiLogModel();
$slowRequests = $apiLogModel->getSlowRequests(1000, 20); // > 1 second

foreach ($slowRequests as $request) {
    echo "Slow: {$request['endpoint']} - {$request['response_time']}ms\n";
}
```

### Scenario 4: Security Monitoring
```php
// Check for suspicious activity
$auditModel = new AuditLogModel();

// Failed login attempts
$failedLogins = $auditModel->getFailedLoginAttempts('today', 50);
if (count($failedLogins) > 10) {
    // Alert admin
    $this->sendSecurityAlert('Multiple failed login attempts detected');
}

// Get all security events
$securityEvents = $auditModel->getSecurityEvents(50);
```

### Scenario 5: Error Resolution Workflow
```php
// 1. Get unresolved errors
$errorModel = new ErrorLogModel();
$errors = $errorModel->getUnresolvedErrors(50);

// 2. Investigate and fix the issue

// 3. Mark as resolved
$errorModel->resolveError($errorId, $adminUserId, 'Fixed by updating API endpoint');
```

### Scenario 6: Generate Reports
```php
// Get comprehensive statistics
$loggingService = new LoggingService();
$stats = $loggingService->getAllLogStats('month');

// Export to file
$filepath = $loggingService->exportLogs('activity', 'csv', [
    'start_date' => '2024-01-01',
    'end_date' => '2024-01-31'
]);

echo "Report exported to: " . $filepath;
```

## 🎨 Frontend Integration Example

### Dashboard Widget
```javascript
// Fetch dashboard data
async function fetchDashboard() {
    const response = await fetch('/admin/monitoring/dashboard?period=today');
    const data = await response.json();
    
    // Update UI
    document.getElementById('total-activities').textContent = 
        data.data.activities.total_activities;
    document.getElementById('total-errors').textContent = 
        data.data.errors.total_errors;
    document.getElementById('api-success-rate').textContent = 
        data.data.api_requests.success_rate + '%';
}

// Real-time updates (call every 30 seconds)
setInterval(fetchDashboard, 30000);
```

### Error List
```javascript
async function fetchErrors(severity = 'all') {
    const url = severity === 'all' 
        ? '/admin/monitoring/errors' 
        : `/admin/monitoring/errors?severity=${severity}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Display errors
    const errorList = document.getElementById('error-list');
    errorList.innerHTML = data.data.map(error => `
        <div class="error-item ${error.severity}">
            <h4>${error.error_type}</h4>
            <p>${error.error_message}</p>
            <span class="badge">${error.severity}</span>
            <button onclick="resolveError('${error.id}')">Resolve</button>
        </div>
    `).join('');
}

async function resolveError(errorId) {
    const notes = prompt('Resolution notes:');
    if (!notes) return;
    
    await fetch(`/admin/monitoring/errors/${errorId}/resolve`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ notes })
    });
    
    // Refresh list
    fetchErrors();
}
```

## 🔧 Troubleshooting

### Logs Not Appearing?

1. **Check Filter Configuration**
   ```php
   // Verify filters are enabled in Config/Filters.php
   ```

2. **Check Database Connection**
   ```bash
   php spark db:table activity_logs
   ```

3. **Check Error Logs**
   ```bash
   tail -f writable/logs/log-*.php
   ```

### Performance Issues?

1. **Add Database Indexes**
   ```sql
   CREATE INDEX idx_activity_user ON activity_logs(user_id, created_at);
   CREATE INDEX idx_error_severity ON error_logs(severity, status);
   CREATE INDEX idx_api_endpoint ON api_logs(endpoint, created_at);
   ```

2. **Enable Log Rotation**
   ```php
   // Run cleanup regularly
   $loggingService->cleanOldLogs([
       'activity_days' => 30,
       'error_days' => 60,
       'api_days' => 30,
       'audit_days' => 180
   ]);
   ```

## 📊 Metrics to Monitor

### Daily Checks
- [ ] Critical errors count
- [ ] API success rate
- [ ] Average response time
- [ ] Failed login attempts

### Weekly Checks
- [ ] Error trends
- [ ] Top active users
- [ ] Most used endpoints
- [ ] Security events

### Monthly Checks
- [ ] Overall system health
- [ ] Performance trends
- [ ] User activity patterns
- [ ] Log storage size

## 📖 Further Reading

- [Complete Documentation](LOGGING_MONITORING_DOCUMENTATION.md)
- [API Reference](API_REFERENCE.md)
- [Best Practices](BEST_PRACTICES.md)

## 🤝 Support

For issues or questions:
- Check the [full documentation](LOGGING_MONITORING_DOCUMENTATION.md)
- Review error logs in `writable/logs/`
- Contact: dev@fullstacktalent.id

---

**Quick Start Version:** 1.0.0  
**Last Updated:** November 2, 2025