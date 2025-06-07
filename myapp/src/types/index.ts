export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'trainer';
  avatar?: string;
  joinedDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  videos: Video[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  url: string;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedVideos: string[];
  lastWatched?: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}