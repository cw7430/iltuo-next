import { z } from 'zod';

export const addressRequestSchema = z.object({
  postalCode: z.string().min(1, '우편 번호를 입력해 주세요.'),
  defaultAddress: z.string().min(1, '주소를 입력해 주세요.'),
  detailAddress: z.string().optional(),
  extraAddress: z.string().optional(),
});

export const addressResponseSchema = z.object({
  addressId: z.string(),
  userId: z.string(),
  postalCode: z.string(),
  defaultAddress: z.string(),
  detailAddress: z.string().nullable(),
  extraAddress: z.string().nullable(),
  isMain: z.boolean(),
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const addressListResponseSchema = z.array(addressResponseSchema);

export type AddressRequestDto = z.infer<typeof addressRequestSchema>;
export type AddressResponseDto = z.infer<typeof addressResponseSchema>;
export type AddressListResponseDto = z.infer<typeof addressListResponseSchema>;
