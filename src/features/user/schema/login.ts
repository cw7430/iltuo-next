import { z } from 'zod';

export const loginRequestSchema = z.object({
  userName: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  isAuto: z.boolean(),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
