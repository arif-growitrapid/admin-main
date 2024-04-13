/**
 * @file Services Types
 * The typescript types for services.
 *
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */
import { ObjectId } from "mongodb";
import { MinAuthType } from "./auth";

export interface DBServiceCollectionType {
  // Meta.
  title: string;
  slug: string;
  is_published: boolean;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;

  // Data.
  services: DBServiceType[];
}

export type ServiceCollectionType = Omit<
  DBServiceCollectionType,
  "services"
> & {
  services: ServiceType[];
};

export interface DBServiceType {
  // Meta.
  _id: ObjectId;
  title: string;
  slug: string;
  is_published: boolean;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;

  // Additional.
  badges: {
    title: string;
    color: string;
    icon: string;
  }[];

  // Data.
  content: string;
  tags: string[];
  categories: string[];
  testimonials: ServicesTestimonialType[];
  features: ServicesFeatureType[];
  pricing_guide: ServicesPricingGuidesType;
  additional_price_dependencies: ServicesAdditionalPriceDependenciesType;
  faqs: ServicesFAQType[];

  // Analytics.
  total_enrolled: number;
  impressions: number;
  reviews: ServicesReviewType[];
}

export type ServiceType = Omit<DBServiceType, "_id"> & {
  _id: string;
};

export type ServicesTestimonialType = {
  _id: string;
  title: string;
  content: string;
  author_name: string;
  author_image: string;
  author_designation: string;
};

export type ServicesFeatureType = {
  title: string;
  description: string;
  icon: string;
  color: string;
  alignment: "left" | "right";
  alpha_image: string;
};

export type ServicesPricingGuidesType = {
  title: string;
  description: string;
  price: number; // In USD.
  includes: {
    content: string;
    is_included: boolean;
  }[];
  delivery_time: {
    garunteed: boolean;
    time: number; // In days.
    margin: number; // In days. +/-.
  };
  revisions: number | "unlimited";
  offers: {
    content: string;
    price: number; // In USD.
    is_active: boolean;
    delivery_time: {
      garunteed: boolean;
      time: number; // In days.
      margin: number; // In days. +/-.
    } | null;
  }[];
}[];

export type ServicesAdditionalPriceDependenciesType = {
  content: string;
  price: number; // In USD.
  is_active: boolean;
  delivery_time: {
    garunteed: boolean;
    time: number; // In days.
    margin: number; // In days. +/-.
  } | null;
}[];

export type ServicesFAQType = {
  question: string;
  answer: string;
  is_active: boolean;
};

export type ServicesReviewType = {
  author: MinAuthType;
  content: string;
  rating: number;
  createdAt: Date;
};
