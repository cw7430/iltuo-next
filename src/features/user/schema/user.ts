import { z } from 'zod';

export const checkUserRequestSchema = z.object({
  userName: z
    .string()
    .min(1, '아이디를 입력해주세요.')
    .regex(
      /^(?=.*[A-Za-z])[A-Za-z0-9]{5,25}$/,
      '아이디는 5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합이어야 합니다.',
    ),
});

export const nativeRegisterRequestSchema = checkUserRequestSchema
  .extend({
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|:;"'<>,.?/~`]).{10,25}$/,
        '비밀번호는 5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합이어야 합니다.',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    realName: z.string().min(1, '이름을 입력해 주세요.'),
    phoneNumber: z
      .string()
      .min(1, '휴대전화 번호을 입력해 주세요.')
      .regex(
        /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/,
        '휴대전화 번호 형식이 올바르지 않습니다.',
      ),
    email: z
      .string()
      .min(1, '이메일 입력해주세요.')
      .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      });
    }
  });

export type CheckUserRequestDto = z.infer<typeof checkUserRequestSchema>;
export type NativeRegisterRequestDto = z.infer<
  typeof nativeRegisterRequestSchema
>;
