export interface ImageRef {
  url?: string | null;
  publicId?: string | null;
}

export interface Creator {
  _id: string;
  name: string;
  username: string;
  role?: string;
  avatarImage?: ImageRef | null;
  description?: string | null;
  occupation?: string | null;
}

export interface Community {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  thumbnail?: ImageRef | null;
  headerImage?: ImageRef | null;
  creator: Creator | string;
  courses: (string | { _id: string; title: string; thumbnail?: ImageRef | null; slug: string })[];
  members?: string[];
  memberCount?: number;
  canEveryOneMessage?: boolean;
  userMessagePermission?: string[];
  isPrivate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  _id?: string;
  title: string;
  description?: string;
  duration?: string;
  typeOfChapter: 'video' | 'resource';
  videoUrl?: string;
  videoId?: string;
  resources?: ImageRef[];
  order?: number;
  demo?: boolean;
}

export interface Rating {
  user: string;
  stars: number;
  description?: string;
  createdAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: ImageRef | null;
  coverImage: ImageRef | null;
  creator: Creator | string;
  category: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  duration?: string;
  chapters?: Chapter[];
  price: number;
  students?: string[];
  studentCount?: number;
  publishedAt?: string | null;
  community?: Community | string | null;
  badges?: string[];
  certificate?: {
    enabled?: boolean;
    template?: string | null;
  };
  ratings?: Rating[];
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchCourseResponse {
  courseDetails: Course;
}

export interface FetchMyCoursesResponse {
  courses: Course[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCourses: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface PostFile {
  url: string;
  publicId: string;
  name?: string;
  type?: string;
}

export interface Comment {
  _id?: string;
  author: Creator | string;
  content: string;
  createdAt?: string;
}

export interface Post {
  _id: string;
  community: Community | string;
  author: Creator | string;
  content: string;
  images: ImageRef[];
  files: PostFile[];
  likes: string[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchPostsResponse {
  posts: Post[];
  totalPosts: number;
  message: string;
}
