import {
  ResponseSingle,
  ResponseWithResult,
  ValidationError,
} from '@/common/api/shared/schema';
import {
  ResponseCode,
  type ResponseCodeType,
} from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';

const baseResponse = {
  code: ResponseCode.SUCCESS.code,
  message: ResponseCode.SUCCESS.message,
};

const successSingle = (): ResponseSingle => baseResponse;

const successWithResult = <T>(result: T): ResponseWithResult<T> => ({
  ...baseResponse,
  result,
});

const fail = (
  code: Exclude<ResponseCodeType, 'SU'>,
  message: string,
  errors?: ValidationError[],
): ResponseWithResult<never> => ({
  code,
  message,
  errors,
});

export const responseSingle = (
  fn: () => Promise<void>,
): Promise<ResponseSingle> =>
  (async () => {
    try {
      await fn();
      return successSingle();
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();

export const responseWithResult = <T>(
  fn: () => Promise<T>,
): Promise<ResponseWithResult<T>> =>
  (async () => {
    try {
      const result = await fn();
      return successWithResult(result);
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();
