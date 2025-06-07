import { Course, Enrollment } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including hooks, context, and state management.',
    instructor: 'Sarah Johnson',
    instructorId: 'trainer1',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    studentsCount: 1234,
    duration: '40 hours',
    level: 'Intermediate',
    category: 'Web Development',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '1', title: 'Introduction to React', duration: '15:30', url: '#', order: 1 },
      { id: '2', title: 'Components and JSX', duration: '22:45', url: '#', order: 2 },
      { id: '3', title: 'State and Props', duration: '18:20', url: '#', order: 3 }
    ],
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Python Data Science Masterclass',
    description: 'Learn data analysis, visualization, and machine learning with Python.',
    instructor: 'Michael Chen',
    instructorId: 'trainer2',
    price: 99.99,
    originalPrice: 149.99,
    rating: 4.9,
    studentsCount: 2156,
    duration: '60 hours',
    level: 'Advanced',
    category: 'Data Science',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '4', title: 'Python Fundamentals', duration: '25:15', url: '#', order: 1 },
      { id: '5', title: 'NumPy and Pandas', duration: '35:40', url: '#', order: 2 }
    ],
    tags: ['Python', 'Data Science', 'Machine Learning'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    instructor: 'David Rodriguez',
    instructorId: 'trainer3',
    price: 89.99,
    rating: 4.7,
    studentsCount: 897,
    duration: '35 hours',
    level: 'Intermediate',
    category: 'Backend Development',
    thumbnail: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '6', title: 'Node.js Basics', duration: '20:30', url: '#', order: 1 },
      { id: '7', title: 'Express Framework', duration: '28:15', url: '#', order: 2 }
    ],
    tags: ['Node.js', 'Express', 'MongoDB'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    title: 'Mobile App Development with Flutter',
    description: 'Create beautiful cross-platform mobile apps using Flutter and Dart.',
    instructor: 'Emily Wang',
    instructorId: 'trainer4',
    price: 119.99,
    originalPrice: 179.99,
    rating: 4.6,
    studentsCount: 743,
    duration: '50 hours',
    level: 'Beginner',
    category: 'Mobile Development',
    thumbnail: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '8', title: 'Flutter Introduction', duration: '18:45', url: '#', order: 1 },
      { id: '9', title: 'Dart Programming', duration: '24:30', url: '#', order: 2 }
    ],
    tags: ['Flutter', 'Dart', 'Mobile'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-25'
  },
  {
    id: '5',
    title: 'DevOps with Docker and Kubernetes',
    description: 'Master containerization and orchestration for modern application deployment.',
    instructor: 'Alex Kumar',
    instructorId: 'trainer5',
    price: 149.99,
    rating: 4.8,
    studentsCount: 567,
    duration: '45 hours',
    level: 'Advanced',
    category: 'DevOps',
    thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '10', title: 'Docker Fundamentals', duration: '30:20', url: '#', order: 1 },
      { id: '11', title: 'Kubernetes Basics', duration: '40:15', url: '#', order: 2 }
    ],
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-28'
  },
  {
    id: '6',
    title: 'AI and Machine Learning Foundations',
    description: 'Introduction to artificial intelligence and machine learning concepts.',
    instructor: 'Dr. Lisa Thompson',
    instructorId: 'trainer6',
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    studentsCount: 1876,
    duration: '70 hours',
    level: 'Intermediate',
    category: 'Artificial Intelligence',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
    videos: [
      { id: '12', title: 'AI Overview', duration: '35:10', url: '#', order: 1 },
      { id: '13', title: 'Neural Networks', duration: '45:25', url: '#', order: 2 }
    ],
    tags: ['AI', 'Machine Learning', 'Neural Networks'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-30'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    userId: 'student1',
    courseId: '1',
    enrolledAt: '2024-01-20',
    progress: 65,
    completedVideos: ['1', '2'],
    lastWatched: '2024-01-30'
  },
  {
    id: '2',
    userId: 'student1',
    courseId: '3',
    enrolledAt: '2024-01-25',
    progress: 30,
    completedVideos: ['6'],
    lastWatched: '2024-01-28'
  }
];

// Initialize localStorage with mock data if not present
export const initializeMockData = () => {
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify(mockCourses));
  }
  if (!localStorage.getItem('enrollments')) {
    localStorage.setItem('enrollments', JSON.stringify(mockEnrollments));
  }
};