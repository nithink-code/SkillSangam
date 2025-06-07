import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { Course, Enrollment } from '../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = () => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    
    const userEnrollments = allEnrollments.filter((e: Enrollment) => e.userId === user?.id);
    const userCourses = allCourses.filter((course: Course) => 
      userEnrollments.some((e: Enrollment) => e.courseId === course.id)
    );

    setEnrollments(userEnrollments);
    setEnrolledCourses(userCourses);

    // Calculate stats
    const totalHrs = userCourses.reduce((sum: number, course: Course) => {
      const hours = parseInt(course.duration.split(' ')[0]) || 0;
      return sum + hours;
    }, 0);

    const completed = userEnrollments.filter((e: Enrollment) => e.progress === 100).length;
    const avgProgress = userEnrollments.length > 0 
      ? userEnrollments.reduce((sum: number, e: Enrollment) => sum + e.progress, 0) / userEnrollments.length 
      : 0;

    setTotalHours(totalHrs);
    setCompletedCourses(completed);
    setAverageProgress(Math.round(avgProgress));
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    return enrollment?.progress || 0;
  };

  const continueLearning = enrolledCourses.filter(course => {
    const progress = getEnrollmentProgress(course.id);
    return progress > 0 && progress < 100;
  });

  const recentCourses = enrolledCourses
    .map(course => ({
      ...course,
      lastWatched: enrollments.find(e => e.courseId === course.id)?.lastWatched
    }))
    .sort((a, b) => {
      if (!a.lastWatched) return 1;
      if (!b.lastWatched) return -1;
      return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalHours}h</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{averageProgress}%</div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Play className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {continueLearning.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress={true}
                  progress={getEnrollmentProgress(course.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Accessed */}
        {recentCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Recently Accessed</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress={true}
                  progress={getEnrollmentProgress(course.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Enrolled Courses */}
        <section>
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress={true}
                  progress={getEnrollmentProgress(course.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Browse Courses
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;