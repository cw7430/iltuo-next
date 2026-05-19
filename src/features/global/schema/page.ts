import { z } from 'zod';

export const pageRequestSchema = z.object({
  page: z.number(),
  size: z.number(),
  blockSize: z.number(),
});

export const pageResponseSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  size: z.number(),
  startPage: z.number(),
  endPage: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export type PageRequestDto = z.infer<typeof pageRequestSchema>;

export type PageResponseDto = z.infer<typeof pageResponseSchema>;
