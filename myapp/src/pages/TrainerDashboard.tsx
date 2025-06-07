import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types';

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    if (user) {
      loadTrainerData();
    }
  }, [user]);

  const loadTrainerData = () => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const trainerCourses = allCourses.filter((course: Course) => course.instructorId === user?.id);
    
    setMyCourses(trainerCourses);
    setTotalCourses(trainerCourses.length);
    
    const students = trainerCourses.reduce((sum: number, course: Course) => sum + course.studentsCount, 0);
    const revenue = trainerCourses.reduce((sum: number, course: Course) => sum + (course.price * course.studentsCount), 0);
    
    setTotalStudents(students);
    setTotalRevenue(revenue);
  };

  const deleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const updatedCourses = allCourses.filter((course: Course) => course.id !== courseId);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      loadTrainerData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trainer Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <Link
            to="/trainer/upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalCourses}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {myCourses.length > 0 ? (myCourses.reduce((sum, course) => sum + course.rating, 0) / myCourses.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {myCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/course/${course.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Course"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => {/* Edit functionality */}}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{course.studentsCount}</div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">${course.price}</div>
                          <div className="text-sm text-gray-600">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{course.rating}</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">${(course.price * course.studentsCount).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {course.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your knowledge by creating your first course</p>
              <Link
                to="/trainer/upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Course
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TrainerDashboard;