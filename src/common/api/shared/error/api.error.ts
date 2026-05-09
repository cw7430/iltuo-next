import { type ResponseCodeType } from '@/common/api/shared/constants';
import { ValidationError } from '@/common/api/shared/schema';

export class ApiError extends Error {
  public readonly code: Exclude<ResponseCodeType, 'SU'>;
  public readonly errors?: ValidationError[];

  constructor(
    code: Exclude<ResponseCodeType, 'SU'>,
    message: string,
    errors?: ValidationError[],
  ) {
    super(message);
    this.code = code;
    this.errors = errors;
    this.name = 'ApiError';
  }
}
