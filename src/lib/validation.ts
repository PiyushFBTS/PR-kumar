import { z } from "zod";

// Self-registration is disabled — accounts are created by an admin
// (see adminUserCreateSchema below).
export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --- Articles ---
export const articleCreateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().max(200_000).optional().default(""),
  coverImage: z.string().trim().max(500).nullable().optional(),
});

export const articleUpdateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().max(200_000).optional().default(""),
  coverImage: z.string().trim().max(500).nullable().optional(),
});

export type ArticleInput = z.infer<typeof articleCreateSchema>;

// --- Admin ---
export const rejectSchema = z.object({
  reason: z.string().trim().min(3, "Provide a brief reason").max(1000),
});

export const adminUserCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email("Enter a valid email").max(160),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80).optional(),
  email: z.email("Enter a valid email").max(160).optional(),
  active: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100).optional(),
});

// --- Account (self-service) ---
export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export const quoteSchema = z.object({
  partner: z.string().trim().min(2, "Partner name is required").max(120),
  quote: z.string().trim().min(3, "Quote is too short").max(1000),
  order: z.number().int().min(0).optional().default(0),
  published: z.boolean().optional().default(true),
});

export const resourceSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(120),
  url: z.url("Enter a valid URL").max(500),
  logo: z.string().trim().max(500).nullable().optional(),
  category: z.string().trim().max(80).nullable().optional(),
  order: z.number().int().min(0).optional().default(0),
});

// --- Contact & Careers ---
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.email("Enter a valid email").max(160),
  phone: z.string().trim().min(6, "Enter a valid contact number").max(20),
  service: z.string().trim().min(1, "Select a service").max(120),
  message: z.string().trim().min(5, "Message is too short").max(5000),
});

export const experienceSchema = z.object({
  company: z.string().trim().max(120).optional().default(""),
  years: z.string().trim().max(20).optional().default(""),
  role: z.string().trim().max(120).optional().default(""),
});

export const jobApplicationSchema = z.object({
  applyType: z.enum(["JOB", "INTERNSHIP", "ARTICLESHIP"]),
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.email("Enter a valid email").max(160),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  hasExperience: z.boolean().default(false),
  experience: experienceSchema.nullable().optional(),
  coverNote: z.string().trim().max(5000).optional().default(""),
});
