import { z } from 'zod';

export const logoutRequestSchema = z.object({
  refreshToken: z.string().nullable(),
});

export type LogoutRequestDto = z.infer<typeof logoutRequestSchema>;
