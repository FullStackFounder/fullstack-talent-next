# Performance Optimization Documentation
## Fullstack Talent Backend - Phase 4

### Overview
Dokumentasi lengkap implementasi Performance Optimization untuk aplikasi Fullstack Talent, mencakup query optimization, database indexing, caching strategy, API response optimization, dan image optimization.

---

## 1. Query Optimization

### A. Menggunakan Base Model

```php
<?php

namespace App\Models;

use App\Models\BaseModel;

class CourseModel extends BaseModel
{
    protected $table = 'courses';
    protected $primaryKey = 'id';
    protected $cacheTTL = 7200; // 2 hours
    
    /**
     * Get published courses dengan caching
     */
    public function getPublishedCourses($limit = 10)
    {
        return $this->findAllCached($limit, 0, [
            'status' => 'published'
        ]);
    }
    
    /**
     * Eager loading dengan relasi
     */
    public function withTutor(callable $callback = null)
    {
        return $this->join('users', 'users.id = courses.tutor_id')
                    ->select('courses.*, users.full_name as tutor_name')
                    ->asObject();
    }
    
    /**
     * Select hanya field yang diperlukan
     */
    public function getCourseListing()
    {
        return $this->selectFields([
            'id', 'title', 'slug', 'thumbnail_url', 
            'price', 'average_rating', 'total_enrolled'
        ])->where('status', 'published')
          ->findAll();
    }
}
```

### B. Query Analyzer

```php
// Analyze specific query
$queryOptimizer = new \App\Libraries\QueryOptimizer();

$query = "SELECT * FROM courses WHERE status = ? ORDER BY created_at DESC LIMIT 10";
$binds = ['published'];

$analysis = $queryOptimizer->analyzeQuery($query, $binds);

print_r($analysis);
/*
Array (
    [query] => SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC LIMIT 10
    [execution_time] => 0.0234
    [is_slow] => false
    [explain] => Array (...)
    [recommendations] => Array (
        [0] => Array (
            [type] => index
            [severity] => high
            [message] => Consider adding index on table: courses
        )
    )
)
*/
```

### C. Batch Operations

```php
// Insert batch dengan chunks
$data = [
    ['student_id' => 1, 'course_id' => 1, 'status' => 'active'],
    ['student_id' => 2, 'course_id' => 1, 'status' => 'active'],
    // ... 1000 records
];

$enrollmentModel = new EnrollmentModel();
$inserted = $enrollmentModel->insertBatch($data, 100); // Process 100 at a time

// Update batch
$updates = [
    ['id' => 1, 'progress_percentage' => 50],
    ['id' => 2, 'progress_percentage' => 75],
];

$updated = $enrollmentModel->updateBatch($updates, 'id', 100);
```

---

## 2. Database Indexing

### A. Create Indexes

```php
$indexing = new \App\Libraries\DatabaseIndexing();

// Create all configured indexes
$results = $indexing->createAllIndexes();

// Create specific table indexes
$results = $indexing->createTableIndexes('courses', [
    'idx_status' => ['status' => 'INDEX'],
    'idx_published' => [
        'columns' => ['status', 'published_at'],
        'type' => 'INDEX'
    ]
]);

// Create composite index
$indexing->createCompositeIndex(
    'enrollments',
    'idx_student_status',
    ['student_id', 'status', 'created_at'],
    'INDEX'
);
```

### B. Analyze Indexes

```php
// Check for missing indexes
$missing = $indexing->checkMissingIndexes('courses');

// Get optimization recommendations
$recommendations = $indexing->optimizeIndexes('courses');

// Find unused indexes
$unused = $indexing->findUnusedIndexes('courses');

// Get index statistics
$stats = $indexing->getIndexStatistics('courses');
```

### C. Command Line Optimization

```bash
# Optimize all indexes
php spark optimize indexes

# Check specific table
php spark db:analyze courses

# Rebuild indexes
php spark db:rebuild-indexes courses
```

---

## 3. Redis Caching Strategy

### A. Basic Usage

```php
$cacheService = new \App\Libraries\CacheService();

// Remember pattern
$courses = $cacheService->remember('featured_courses', function() {
    return $courseModel->where('is_featured', 1)
                      ->where('status', 'published')
                      ->findAll();
}, 3600); // Cache for 1 hour

// Get with default
$user = $cacheService->get('user_' . $userId, null);

// Put into cache
$cacheService->put('user_' . $userId, $userData, 3600);

// Forever cache
$cacheService->forever('settings', $settings);

// Delete from cache
$cacheService->delete('user_' . $userId);
```

### B. Cache Tags

```php
// Cache with tags
$cacheService->tags(['courses', 'featured'])
             ->put('featured_courses', $courses, 3600);

// Get tagged cache
$courses = $cacheService->tags(['courses', 'featured'])
                       ->get('featured_courses');

// Flush by tag
$cacheService->tags('courses')->flush();
```

### C. Cache Locking (Prevent Stampede)

```php
// Prevent cache stampede
$data = $cacheService->lockAndRemember('expensive_query', function() {
    // Expensive operation
    return $this->model->complexQuery();
}, 3600, 10); // Cache for 1 hour, lock for 10 seconds
```

### D. Cache Warming

```php
// In CronJob atau Command
$cacheService->warmUp('courses', [
    'featured' => $featuredCourses,
    'popular' => $popularCourses,
    'recent' => $recentCourses
]);
```

### E. Command Line

```bash
# Clear all cache
php spark cache:clear

# Warm up cache
php spark optimize cache

# View cache statistics
php spark cache:stats
```

---

## 4. API Response Optimization

### A. Basic Usage

```php
<?php

namespace App\Controllers\API;

use App\Libraries\ResponseOptimizer;

class CourseController extends BaseController
{
    protected $responseOptimizer;
    
    public function __construct()
    {
        $this->responseOptimizer = new ResponseOptimizer();
    }
    
    public function index()
    {
        $courses = $this->courseModel->getPublishedCourses();
        
        return $this->responseOptimizer->success([
            'data' => $courses
        ]);
    }
    
    public function show($id)
    {
        $course = $this->courseModel->find($id);
        
        if (!$course) {
            return $this->responseOptimizer->notFound('Course not found');
        }
        
        return $this->responseOptimizer->success($course);
    }
    
    public function store()
    {
        $data = $this->request->getJSON(true);
        
        if (!$this->validate($rules)) {
            return $this->responseOptimizer->validationError(
                $this->validator->getErrors()
            );
        }
        
        $course = $this->courseModel->insert($data);
        
        return $this->responseOptimizer->created($course, 'Course created successfully');
    }
}
```

### B. Pagination Response

```php
public function list()
{
    $page = $this->request->getGet('page') ?? 1;
    $perPage = $this->request->getGet('per_page') ?? 20;
    
    $result = $this->courseModel->paginateOptimized($perPage, 'default', $page);
    
    return $this->responseOptimizer->optimize([
        'data' => $result['data'],
        'pagination' => $result['pager']
    ]);
}
```

### C. Response dengan Caching Headers

```php
public function staticData()
{
    $data = $this->settingsModel->getPublicSettings();
    
    return $this->responseOptimizer->optimize([
        'data' => $data,
        'cache' => [
            'cacheable' => true,
            'max_age' => 86400 // 24 hours
        ]
    ]);
}
```

### D. ETag Support

```php
// Automatically generates and checks ETag
// Returns 304 Not Modified if client has cached version
public function show($id)
{
    $course = $this->courseModel->findCached($id);
    
    // Response optimizer will handle ETag automatically
    return $this->responseOptimizer->optimize(['data' => $course]);
}
```

---

## 5. Image Optimization

### A. Upload and Optimize

```php
<?php

namespace App\Controllers;

use App\Libraries\ImageOptimizer;

class UploadController extends BaseController
{
    protected $imageOptimizer;
    
    public function __construct()
    {
        $this->imageOptimizer = new ImageOptimizer();
    }
    
    public function uploadImage()
    {
        $file = $this->request->getFile('image');
        
        if (!$file->isValid()) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Invalid file'
            ]);
        }
        
        try {
            $result = $this->imageOptimizer->upload($file, 'courses');
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $result
            ]);
            /*
            {
                "success": true,
                "data": {
                    "original": "http://example.com/uploads/images/courses/img_123.jpg",
                    "webp": "http://example.com/uploads/images/courses/img_123.webp",
                    "thumbnails": {
                        "small": "http://example.com/uploads/images/courses/img_123_small.jpg",
                        "medium": "http://example.com/uploads/images/courses/img_123_medium.jpg",
                        "large": "http://example.com/uploads/images/courses/img_123_large.jpg"
                    },
                    "info": {
                        "width": 1920,
                        "height": 1080,
                        "mime": "image/jpeg",
                        "size": 245760,
                        "size_formatted": "240 KB"
                    }
                }
            }
            */
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
```

### B. Generate Responsive HTML

```php
// In View or Controller
$imageData = [
    'original' => 'http://example.com/uploads/images/course.jpg',
    'webp' => 'http://example.com/uploads/images/course.webp',
    'thumbnails' => [...]
];

$html = $this->imageOptimizer->getResponsiveHTML(
    $imageData,
    'Course Thumbnail',
    'course-thumbnail'
);

echo $html;
/*
<picture>
    <source type="image/webp" srcset="http://example.com/uploads/images/course.webp">
    <img src="http://example.com/uploads/images/course.jpg" 
         alt="Course Thumbnail" 
         class="course-thumbnail" 
         loading="lazy">
</picture>
*/
```

### C. Lazy Loading Placeholder

```php
$placeholder = $this->imageOptimizer->generatePlaceholder($imagePath, 20, 20);

echo '<img src="' . $placeholder . '" 
          data-src="' . $actualImageUrl . '" 
          class="lazyload">';
```

### D. Batch Optimization

```bash
# Optimize all images
php spark optimize images

# Or programmatically
$images = [...]; // Array of file paths
$results = $imageOptimizer->batchOptimize($images, function($current, $total) {
    echo "Processing: {$current}/{$total}\n";
});
```

---

## 6. Performance Monitoring

### A. Basic Monitoring

```php
$monitor = new \App\Libraries\PerformanceMonitor();

// Monitor specific section
$monitor->start('database_query');
$data = $model->complexQuery();
$metrics = $monitor->stop('database_query');

// Get overall metrics
$overallMetrics = $monitor->getMetrics();

// Log performance
$monitor->log('api_endpoint');

// Store for analysis
$monitor->store('/api/courses', [
    'user_id' => $userId,
    'filters' => $filters
]);
```

### B. In Controller

```php
<?php

namespace App\Controllers\API;

use App\Libraries\PerformanceMonitor;

class CourseController extends BaseController
{
    protected $monitor;
    
    public function __construct()
    {
        $this->monitor = new PerformanceMonitor();
    }
    
    public function list()
    {
        $this->monitor->start('total');
        
        // Database query
        $this->monitor->start('database');
        $courses = $this->courseModel->getPublishedCourses();
        $this->monitor->stop('database');
        
        // Processing
        $this->monitor->start('processing');
        $processed = $this->processData($courses);
        $this->monitor->stop('processing');
        
        $this->monitor->stop('total');
        
        // Get metrics
        $metrics = $this->monitor->getMetrics();
        
        // Log if slow
        if ($metrics['total_execution_time'] > 1.0) {
            $this->monitor->log('slow_endpoint');
        }
        
        return $this->response->setJSON([
            'data' => $processed,
            '_performance' => $this->monitor->getFormattedMetrics() // Optional
        ]);
    }
}
```

### C. Generate Report

```php
$report = $monitor->generateReport();

print_r($report);
/*
Array (
    [overview] => Array (
        [execution_time] => 0.2345s
        [memory_used] => 12.45 MB
        [peak_memory] => 15.67 MB
        [query_count] => 15
    )
    [database] => Array (
        [total_queries] => 15
        [total_time] => 0.1234
        [avg_time] => 0.0082
        [slow_queries] => Array (...)
    )
    [cache] => Array (
        [hits] => 120
        [misses] => 15
        [hit_rate] => 88.89%
    )
    [system] => Array (
        [memory_limit] => 256M
        [memory_used] => 45.67 MB
        [cpu_usage] => 2.3
    )
)
*/
```

---

## 7. Command Line Tools

### A. Optimize All

```bash
# Run all optimizations
php spark optimize all
```

### B. Specific Optimizations

```bash
# Cache optimization
php spark optimize cache

# Database optimization
php spark optimize database

# Index optimization
php spark optimize indexes

# Image optimization
php spark optimize images

# Query analysis
php spark optimize queries
```

### C. Scheduled Tasks

```php
// In app/Config/Events.php or Scheduler

use App\Commands\Optimize;

// Run daily at 2 AM
Events::on('pre_system', function() {
    if (date('H:i') === '02:00') {
        command('optimize all');
    }
});
```

---

## 8. Best Practices

### A. Query Optimization

1. **Select Only Needed Fields**
   ```php
   // Bad
   $users = $model->findAll();
   
   // Good
   $users = $model->select('id, name, email')->findAll();
   ```

2. **Use Indexes Wisely**
   ```php
   // Always index foreign keys
   // Index frequently used WHERE columns
   // Index columns used in ORDER BY
   // Use composite indexes for multiple columns
   ```

3. **Avoid N+1 Queries**
   ```php
   // Bad
   foreach ($courses as $course) {
       $course->tutor = $tutorModel->find($course->tutor_id);
   }
   
   // Good
   $courses = $courseModel->withTutor()->findAll();
   ```

### B. Caching Strategy

1. **Cache Hot Data**
   ```php
   // Cache frequently accessed data
   $featured = $cache->remember('featured_courses', fn() => 
       $courseModel->getFeaturedCourses(), 3600
   );
   ```

2. **Invalidate Smartly**
   ```php
   // Invalidate related cache when data changes
   public function update($id, $data)
   {
       $result = parent::update($id, $data);
       if ($result) {
           $cache->tags('courses')->flush();
       }
       return $result;
   }
   ```

3. **Use Cache Tags**
   ```php
   // Group related cache
   $cache->tags(['courses', 'featured'])->put('data', $data);
   ```

### C. API Response

1. **Compress Responses**
   - Automatically enabled for responses > 1KB
   - Reduces bandwidth usage

2. **Use ETags**
   - Automatically generated
   - Reduces unnecessary data transfer

3. **Set Proper Cache Headers**
   ```php
   return $response->optimize([
       'data' => $data,
       'cache' => ['cacheable' => true, 'max_age' => 3600]
   ]);
   ```

### D. Image Optimization

1. **Always Optimize on Upload**
2. **Generate Multiple Sizes**
3. **Use WebP Format**
4. **Implement Lazy Loading**
5. **Use CDN for Static Assets**

---

## 9. Monitoring & Debugging

### A. Enable Query Logging

```php
// In Config/Database.php
public $default = [
    // ...
    'DBDebug' => true, // Enable in development
];
```

### B. Performance Dashboard

```php
// Create admin dashboard endpoint
public function performance()
{
    $monitor = new PerformanceMonitor();
    $report = $monitor->generateReport();
    
    return view('admin/performance', ['report' => $report]);
}
```

### C. Slow Query Log

```php
// Automatically logged in QueryOptimizer
// Check logs/log-YYYY-MM-DD.log for slow queries
```

---

## 10. Production Checklist

- [ ] All indexes created and optimized
- [ ] Redis configured and running
- [ ] Cache warming scheduled
- [ ] Image optimization enabled
- [ ] Response compression enabled
- [ ] ETags enabled
- [ ] Query logging disabled in production
- [ ] Performance monitoring enabled
- [ ] CDN configured for static assets
- [ ] Cron jobs scheduled for optimization
- [ ] Database backups scheduled

---

## Support

For issues or questions, please contact the development team.

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Fullstack Talent Backend Team**