import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showProgress, progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="text-sm text-gray-500">{course.studentsCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">${course.price}</div>
            {course.originalPrice && (
              <div className="text-sm text-gray-500 line-through">${course.originalPrice}</div>
            )}
          </div>
        </div>

        {showProgress && progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <Link
          to={`/course/${course.id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
        >
          {showProgress ? 'Continue Learning' : 'View Course'}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;