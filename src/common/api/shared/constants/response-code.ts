import { StatusCodes } from 'http-status-codes';

export const ResponseCode = {
  /** 200 OK */
  SUCCESS: {
    code: 'SU',
    message: '요청이 성공적으로 처리되었습니다.',
    status: StatusCodes.OK,
  },

  /** 400 BAD REQUEST */
  VALIDATION_ERROR: {
    code: 'VE',
    message: '입력값이 잘못되었습니다.',
    status: StatusCodes.BAD_REQUEST,
  },

  /** 400 BAD REQUEST */
  CUSTOM_VALIDATION_ERROR: {
    code: 'CVE',
    message: '입력값이 잘못되었습니다.',
    status: StatusCodes.BAD_REQUEST,
  },

  /** 401 UNAUTHORIZED */
  UNAUTHORIZED: {
    code: 'UA',
    message: '로그인이 필요합니다.',
    status: StatusCodes.UNAUTHORIZED,
  },

  /** 401 UNAUTHORIZED */
  LOGIN_ERROR: {
    code: 'LGE',
    message: '아이디 또는 비밀번호가 잘못되었습니다.',
    status: StatusCodes.UNAUTHORIZED,
  },

  /** 403 FORBIDDEN */
  FORBIDDEN: {
    code: 'FB',
    message: '접근 권한이 없습니다.',
    status: StatusCodes.FORBIDDEN,
  },

  /** 404 NOT FOUND */
  RESOURCE_NOT_FOUND: {
    code: 'RNF',
    message: '요청한 자원을 찾을 수 없습니다.',
    status: StatusCodes.NOT_FOUND,
  },

  /** 404 NOT FOUND */
  ENDPOINT_NOT_FOUND: {
    code: 'ENF',
    message: '요청한 경로가 잘못되었습니다.',
    status: StatusCodes.NOT_FOUND,
  },

  /** 409 CONFLICT */
  DUPLICATE_RESOURCE: {
    code: 'DR',
    message: '이미 존재하는 항목입니다.',
    status: StatusCodes.CONFLICT,
  },

  /** 409 CONFLICT */
  CUSTOM_DUPLICATE_RESOURCE: {
    code: 'CDR',
    message: '이미 존재하는 항목입니다.',
    status: StatusCodes.CONFLICT,
  },

  /** 409 CONFLICT */
  CONFLICT: {
    code: 'CF',
    message: '요청이 현재 상태와 충돌합니다.',
    status: StatusCodes.CONFLICT,
  },

  /** 500 INTERNAL SERVER ERROR */
  INTERNAL_SERVER_ERROR: {
    code: 'ISE',
    message: '서버에서 문제가 발생했습니다.',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  },

  /** 500 INTERNAL SERVER ERROR */
  CUSTOM_INTERNAL_SERVER_ERROR: {
    code: 'CISE',
    message: '서버에서 문제가 발생했습니다.',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  },
} as const;

export const ResponseCodeValues = Object.values(ResponseCode).map(
  (responseCode) => responseCode.code,
);

export type ResponseCodeKey = keyof typeof ResponseCode;
export type ResponseCodeType =
  (typeof ResponseCode)[keyof typeof ResponseCode]['code'];
