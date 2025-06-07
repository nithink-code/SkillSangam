import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, Video } from '../types';

const UploadCourse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: '',
    thumbnail: '',
    duration: '',
    tags: ''
  });

  const [videos, setVideos] = useState<Omit<Video, 'id'>[]>([
    { title: '', duration: '', url: '', order: 1 }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Web Development',
    'Data Science',
    'Backend Development',
    'Mobile Development',
    'DevOps',
    'Artificial Intelligence',
    'Cybersecurity',
    'Game Development',
    'UI/UX Design',
    'Cloud Computing'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (index: number, field: keyof Omit<Video, 'id'>, value: string) => {
    setVideos(prev => prev.map((video, i) => 
      i === index ? { ...video, [field]: value } : video
    ));
  };

  const addVideo = () => {
    setVideos(prev => [...prev, { title: '', duration: '', url: '', order: prev.length + 1 }]);
  };

  const removeVideo = (index: number) => {
    if (videos.length > 1) {
      setVideos(prev => prev.filter((_, i) => i !== index).map((video, i) => ({ ...video, order: i + 1 })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        instructor: user.name,
        instructorId: user.id,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        rating: 0,
        studentsCount: 0,
        duration: formData.duration,
        level: formData.level,
        category: formData.category,
        thumbnail: formData.thumbnail || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500',
        videos: videos.map((video, index) => ({
          ...video,
          id: `${Date.now()}-${index}`,
        })),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      existingCourses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(existingCourses));

      navigate('/trainer/dashboard');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/trainer/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600">Share your knowledge with students around the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your course title"
                />
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what students will learn in this course"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10 hours"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, JavaScript, Frontend (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (Optional)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="149.99"
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              <button
                type="button"
                onClick={addVideo}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Video</span>
              </button>
            </div>

            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Video {index + 1}</h3>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={video.title}
                        onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Introduction to React Hooks"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        required
                        value={video.duration}
                        onChange={(e) => handleVideoChange(index, 'duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15:30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={video.url}
                        onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Thumbnail</h2>
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-sm text-gray-500 mt-2">
                If not provided, a default thumbnail will be used.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/trainer/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Upload className="h-5 w-5" />
              <span>{isSubmitting ? 'Creating Course...' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCourse;