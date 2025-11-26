// src/lib/response.ts
import { NextResponse } from 'next/server';

type CommonResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  timestamp: string;
};

/**
 * 요청에 대한 성공 (200 OK) 응답 전송
 * @param data 전송할 데이터
 * @param status HTML 응답 코드
 * @returns Response 데이터
 */
export const responseSuccess = <T>(data: T, status: number = 200) => {
  const body: CommonResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
};

/**
 * 요청에 대한 실패 응답 전송
 * @param message 오류 메세지
 * @param code 오류 코드 (기본 값: INTERNAL_SERVER_ERROR)
 * @param status HTML 응답 코드 (기본 값: 500)
 * @returns Response 데이터
 */
export const responseError = (
  message: string,
  code: string = 'INTERNAL_SERVER_ERROR',
  status: number = 500
) => {
  const body: CommonResponse = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
};

// 400 Bad Request
export const responseBadRequest = (message = '잘못된 요청입니다.') =>
  responseError(message, 'BAD_REQUEST', 400);

// 401 Unauthorized
export const responseUnauthorized = (message = '로그인이 필요합니다.') =>
  responseError(message, 'UNAUTHORIZED', 401);

// 404 Not Found
export const responseNotFound = (message = '리소스를 찾을 수 없습니다.') =>
  responseError(message, 'NOT_FOUND', 404);
