import { z } from "zod";
import {
  COURSE_PROVIDERS_SCHEMA,
  COURSE_PROVIDER_KEYS,
} from "./upload/courses.types";

export const serverRequestDataSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
});

export const serverRequestSchema = z.object({
  tag: z.string(),
  data: z.array(serverRequestDataSchema),
});

export const serverResponseDataSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
  statusCode: z.enum(["pending", "parsing", "done", "error"]),

  // Optional fields.
  response: COURSE_PROVIDERS_SCHEMA.optional(),
  status: z.string().optional(),
  error: z.string().optional(),
});

export const serverResponseSchema = z.object({
  tag: z.string(),
  status: z.enum(["parsing", "done", "error", "partial_error"]),
  data: z.array(serverResponseDataSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});
