'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { enrollmentApi } from '@/lib/api/enrollment';
import { courseApi } from '@/lib/api/course';
import {
  Users,
  UserCheck,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  Loader2
} from 'lucide-react';

interface StudentData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar?: string;
  courses: Array<{
    id: string;
    course_id: string;
    course_title: string;
    progress: number;
    status: 'active' | 'completed' | 'pending' | 'cancelled';
    enrolled_at: string;
    last_activity: string;
  }>;
  total_courses: number;
  average_progress: number;
  last_activity: string;
}

interface Statistics {
  total_students: number;
  active_students: number;
  avg_completion_rate: number;
  recent_enrollments: number;
}

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total_students: 0,
    active_students: 0,
    avg_completion_rate: 0,
    recent_enrollments: 0,
  });
  const [tutorCourses, setTutorCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'progress'>('recent');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchQuery, selectedCourse, selectedStatus, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tutor's courses
      const coursesResponse = await courseApi.getTutorCourses();
      const courses = coursesResponse.data || [];
      setTutorCourses(courses);

      // Fetch enrollments for all courses
      const allEnrollments: any[] = [];
      for (const course of courses) {
        try {
          const enrollmentsResponse = await enrollmentApi.getCourseEnrollments(course.id);
          const enrollments = enrollmentsResponse.data || [];
          allEnrollments.push(...enrollments.map((e: any) => ({
            ...e,
            course_title: course.title,
            course_id: course.id,
          })));
        } catch (err) {
          console.error(`Error fetching enrollments for course ${course.id}:`, err);
        }
      }

      // Group enrollments by student
      const studentMap = new Map<string, StudentData>();

      allEnrollments.forEach((enrollment) => {
        const userId = enrollment.user_id;

        if (!studentMap.has(userId)) {
          studentMap.set(userId, {
            id: userId,
            user_id: userId,
            full_name: enrollment.user?.full_name || 'Unknown Student',
            email: enrollment.user?.email || '',
            avatar: enrollment.user?.avatar,
            courses: [],
            total_courses: 0,
            average_progress: 0,
            last_activity: enrollment.updated_at || enrollment.created_at,
          });
        }

        const student = studentMap.get(userId)!;
        student.courses.push({
          id: enrollment.id,
          course_id: enrollment.course_id,
          course_title: enrollment.course_title,
          progress: enrollment.progress || 0,
          status: enrollment.status || 'active',
          enrolled_at: enrollment.created_at,
          last_activity: enrollment.updated_at || enrollment.created_at,
        });

        // Update last activity to the most recent
        if (new Date(enrollment.updated_at) > new Date(student.last_activity)) {
          student.last_activity = enrollment.updated_at;
        }
      });

      // Calculate average progress and total courses for each student
      const studentsData = Array.from(studentMap.values()).map(student => ({
        ...student,
        total_courses: student.courses.length,
        average_progress: student.courses.reduce((sum, c) => sum + c.progress, 0) / student.courses.length,
      }));

      setStudents(studentsData);

      // Calculate statistics
      const totalStudents = studentsData.length;
      const activeStudents = studentsData.filter(s =>
        s.courses.some(c => c.status === 'active')
      ).length;
      const avgCompletion = studentsData.reduce((sum, s) => sum + s.average_progress, 0) / (totalStudents || 1);

      // Recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEnrollments = allEnrollments.filter(e =>
        new Date(e.created_at) > thirtyDaysAgo
      ).length;

      setStatistics({
        total_students: totalStudents,
        active_students: activeStudents,
        avg_completion_rate: Math.round(avgCompletion),
        recent_enrollments: recentEnrollments,
      });
    } catch (error: any) {
      console.error('Error fetching students data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.full_name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }

    // Course filter
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(student =>
        student.courses.some(c => c.course_id === selectedCourse)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(student =>
        student.courses.some(c => c.status === selectedStatus)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        case 'progress':
          return b.average_progress - a.average_progress;
        case 'recent':
        default:
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
      }
    });

    setFilteredStudents(filtered);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const exportStudentsData = () => {
    // Prepare CSV data
    const headers = ['Name', 'Email', 'Total Courses', 'Average Progress', 'Last Activity'];
    const rows = filteredStudents.map(student => [
      student.full_name,
      student.email,
      student.total_courses.toString(),
      `${student.average_progress.toFixed(1)}%`,
      formatDate(student.last_activity),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau semua siswa dari kursus Anda
            </p>
          </div>
          <button
            onClick={exportStudentsData}
            disabled={filteredStudents.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : statistics.total_students}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : statistics.active_students}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : `${statistics.avg_completion_rate}%`}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New (30 days)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : statistics.recent_enrollments}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Kursus</option>
                {tutorCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="recent">Terbaru</option>
                <option value="name">Nama (A-Z)</option>
                <option value="progress">Progress Tertinggi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada siswa ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kursus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {student.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {student.full_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {student.total_courses} kursus
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px]">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${student.average_progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(student.average_progress)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {formatDate(student.last_activity)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            // TODO: Navigate to student detail page
                            alert(`Detail view for ${student.full_name} - Coming soon!`);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && filteredStudents.length > 0 && (
          <p className="text-sm text-gray-600 text-center">
            Menampilkan {filteredStudents.length} dari {students.length} siswa
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}