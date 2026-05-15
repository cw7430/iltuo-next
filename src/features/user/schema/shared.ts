import { z } from 'zod';

export const authStateDataSchema = z.object({
  accessTokenExpiresAtMs: z.number().nullable(),
  authRole: z.enum(['USER', 'ADMIN']).nullable(),
  authType: z.enum(['NATIVE', 'SOCIAL']).nullable(),
});

export const loginAndRefreshResponseSchema = authStateDataSchema.extend({
  accessTokenExpiresAtMs: z.number(),
  authRole: z.enum(['USER', 'ADMIN']),
  authType: z.enum(['NATIVE', 'SOCIAL']),
});

export const loginAndRefreshResponseSchemaForServer =
  loginAndRefreshResponseSchema.extend({
    accessToken: z.string(),
    refreshToken: z.string(),
    refreshTokenExpiresAtMs: z.number(),
    isAuto: z.boolean(),
  });

export type AuthStateData = z.infer<typeof authStateDataSchema>;

export type LoginAndRefreshResponseDto = z.infer<
  typeof loginAndRefreshResponseSchema
>;

export type LoginAndRefreshResponseDtoForServer = z.infer<
  typeof loginAndRefreshResponseSchemaForServer
>;

export type AuthState = AuthStateData & {
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;

  login: (data: LoginAndRefreshResponseDto) => void;

  logout: () => void;
};
