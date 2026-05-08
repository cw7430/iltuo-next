import { type ResponseCodeType } from '@/common/api/constants';
import { ValidationError } from '@/common/api/schema';

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
