/**
 * @file Course Types
 * The typescript types for course.
 *
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import { ObjectId } from "mongodb";

export const COURSE_PROVIDERS = [
  "coursera",
  "udemy",
  "edx",
  "khanacademy",
  "others",
  "selfhosted",
] as const;

export const COURSE_PROVIDER_NAMES = {
  coursera: "Coursera",
  udemy: "Udemy",
  edx: "edX",
  khanacademy: "Khan Academy",
  others: "Others",
  selfhosted: "Self Hosted",
};

export const COURSE_PROVIDER_URLS = {
  coursera: "https://www.coursera.org/",
  udemy: "https://www.udemy.com/",
  edx: "https://www.edx.org/",
  khanacademy: "https://www.khanacademy.org/",
  others: "",
  selfhosted: "",
};

export type CourseMetaType<Provider extends keyof CoursesTypes> = {
  provider: Provider; // The provider of the course
  slug: string; // The slug of the course

  published_by: string; // User ID of the user who added this course
  published_at: Date; // The date when this course was added
  updated_by: string; // User ID of the user who updated this course
  updated_at: Date; // The date when this course was updated

  is_published: boolean; // Is the course published or not
  is_featured: boolean; // Is the course featured or not
  is_verified: boolean; // Is the course verified or not
  is_approved: boolean; // Is the course approved or not
  is_premium: boolean; // Is the course premium or not

  // Tag is a special string that the user will enter while adding the courses in bulk.
  // This tag will be used to identify the courses added by the user.
  // This tags will be used to identify the courses for CRUD operations.
  tag_string: string; // The tags of the course in string format

  // For internal use
  views: number;
  likes: number;
  saves: number;
  viewed_by: string[];
  viewed_by_ip: string[];
  liked_by: string[];
  saved_by: string[];

  // For SEO
  is_seo_compatabile: boolean;

  // For social media
  is_open_graph_compatabile: boolean;
};

export type DBCourseType<Provider extends keyof CoursesTypes> = {
  _id: ObjectId;
  meta: CourseMetaType<Provider>;
  data: CoursesTypes[Provider];
};

export interface CoursesTypes {
  coursera: {
    title: string;
    description: string;
    instructors: string[];
    total_enrolled_students: string;
    rating: string;
    duration: string;
    experience: string;
    reviews: string;
    what_you_will_learn: string[];
    tags: string[];
    avg_salary: string;
    job_openings: string;
    guarantee_percentage: string;
    outcomes: string;
    series: {
      title: string;
      link: string;
      duration: string;
      rating: string;
      internalTags: string[];
      whatYouWillLearn: string[];
    }[];
  };

  udemy: {
    title: string;
  };

  edx: {
    title: string;
    description: string;
    rating: string;
    duration: string;
    experience: string;
    reviews: string;
    tags: string[];
  };

  khanacademy: {
    title: string;
    description: string;
    rating: string;
    duration: string;
    experience: string;
    reviews: string;
    tags: string[];
  };

  others: {
    title: string;
    description: string;
    rating: string;
    duration: string;
    experience: string;
    reviews: string;
    tags: string[];
  };

  selfhosted: {
    title: string;
    description: string;
    rating: string;
    duration: string;
    experience: string;
    reviews: string;
    tags: string[];
  };
}
