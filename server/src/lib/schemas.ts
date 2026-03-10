import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .openapi({ example: "user@example.com" });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
  .openapi({ example: "password123!" });

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(255, "Name must be less than 255 characters")
  .openapi({ example: "John Doe" });

export const uuidSchema = z
  .string()
  .uuid("Invalid UUID format")
  .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" });

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .openapi({ example: "https://example.com" });

export const RegisterSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
  })
  .strict();

export const LoginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const CreateUrlSchema = z
  .object({
    url: urlSchema,
  })
  .strict();

export const UpdateUrlSchema = z
  .object({
    url: urlSchema,
  })
  .strict();

export const UrlIdParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const BulkDeleteUrlsSchema = z
  .object({
    ids: z.array(uuidSchema).min(1, "At least one ID is required"),
  })
  .strict();

export const AnalyticsIdParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const UserResponseSchema = z
  .object({
    id: uuidSchema,
    email: emailSchema,
    name: nameSchema,
  })
  .strict();

export const UrlResponseSchema = z
  .object({
    id: uuidSchema,
    url: z.string(),
    short_code: z.string(),
    user_id: uuidSchema,
    created_at: z.string().datetime(),
  });

export const AnalyticsResponseSchema = z
  .object({
    id: uuidSchema,
    url_id: uuidSchema,
    ip_address: z.string(),
    user_agent: z.string(),
    clicked_at: z.string().datetime(),
  });

export const ErrorResponseSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export const MessageResponseSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export const UrlsResponseSchema = z.object({
  message: z.string(),
  data: z.array(UrlResponseSchema),
});

export const UrlResponseWrapSchema = z.object({
  message: z.string(),
  data: UrlResponseSchema,
});

export const AnalyticsListResponseSchema = z.object({
  message: z.string(),
  data: z.array(AnalyticsResponseSchema),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUrlInput = z.infer<typeof CreateUrlSchema>;
export type UpdateUrlInput = z.infer<typeof UpdateUrlSchema>;
export type UrlIdParam = z.infer<typeof UrlIdParamSchema>;
export type BulkDeleteInput = z.infer<typeof BulkDeleteUrlsSchema>;
export type AnalyticsIdParam = z.infer<typeof AnalyticsIdParamSchema>;
