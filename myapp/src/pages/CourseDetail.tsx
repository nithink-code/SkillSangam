import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Play, CheckCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, Enrollment } from '../types';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [id, user]);

  const loadCourseData = () => {
    if (!id) return;

    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const foundCourse = allCourses.find((c: Course) => c.id === id);
    
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Check if user is enrolled
      if (user) {
        const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const userEnrollment = allEnrollments.find((e: Enrollment) => 
          e.userId === user.id && e.courseId === id
        );
        
        if (userEnrollment) {
          setIsEnrolled(true);
          setEnrollment(userEnrollment);
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!course) return;

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId: user.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedVideos: []
    };

    const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    allEnrollments.push(newEnrollment);
    localStorage.setItem('enrollments', JSON.stringify(allEnrollments));

    // Update course student count
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const updatedCourses = allCourses.map((c: Course) => 
      c.id === course.id ? { ...c, studentsCount: c.studentsCount + 1 } : c
    );
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    setIsEnrolled(true);
    setEnrollment(newEnrollment);
    setCourse(prev => prev ? { ...prev, studentsCount: prev.studentsCount + 1 } : null);
  };

  const markVideoComplete = (videoId: string) => {
    if (!enrollment || !course) return;

    const updatedCompletedVideos = [...enrollment.completedVideos];
    if (!updatedCompletedVideos.includes(videoId)) {
      updatedCompletedVideos.push(videoId);
    }

    const progress = Math.round((updatedCompletedVideos.length / course.videos.length) * 100);

    const updatedEnrollment = {
      ...enrollment,
      completedVideos: updatedCompletedVideos,
      progress,
      lastWatched: new Date().toISOString()
    };

    const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const updatedEnrollments = allEnrollments.map((e: Enrollment) =>
      e.id === enrollment.id ? updatedEnrollment : e
    );
    localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));

    setEnrollment(updatedEnrollment);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to courses</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>{course.studentsCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-5 w-5" />
                  <span>by {course.instructor}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">${course.price}</div>
                  {course.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">${course.originalPrice}</div>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Enrolled</span>
                      </div>
                    </div>
                    
                    {enrollment && enrollment.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate('/student/dashboard')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Go to My Learning
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Enroll Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What you'll learn */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      enrollment?.completedVideos.includes(video.id)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {enrollment?.completedVideos.includes(video.id) ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Play className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{video.title}</h3>
                        <p className="text-sm text-gray-600">Video {index + 1}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{video.duration}</span>
                      {isEnrolled && !enrollment?.completedVideos.includes(video.id) && (
                        <button
                          onClick={() => markVideoComplete(video.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {course.instructor.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{course.instructor}</h3>
                  <p className="text-sm text-gray-600">Course Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students Enrolled</span>
                  <span className="font-medium">{course.studentsCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Videos</span>
                  <span className="font-medium">{course.videos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;