// src/lib/apiResponses.ts

import { NextResponse } from "next/server";

/**
 * 401 Unauthorized 응답을 반환합니다.
 * @param message - 응답에 포함될 에러 메세지 (기본값: "Unauthorized")
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * 404 Not Found 응답을 반환합니다.
 * @param message - 응답에 포함될 에러 메세지 (기본값: "Not Found")
 */
export function notFoundResponse(message: string = "Not Found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * 400 Bad Request 응답을 반환합니다.
 * @param message - 응답에 포함될 에러 메세지 (기본값: "Bad Request")
 */
export function badRequestResponse(message: string = "Bad Request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * 500 Internal Server Error 응답을 반환합니다.
 * @param message - 응답에 포함될 에러 메세지 (기본값: "Internal Server Error")
 */
export function serverErrorResponse(message: string = "Internal Server Error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * 200 OK (성공) 응답을 반환합니다.
 * @param data - 응답에 포함될 데이터
 */
export function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 200 });
}
