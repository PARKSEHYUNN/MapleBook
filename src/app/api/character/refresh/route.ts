// src/app/api/character/refresh/route.ts
import { responseBadRequest, responseSuccess } from '@/lib/api/response';
import { prisma } from '@/lib/config/db';
import { fetchAndSaveCharacter } from '@/lib/services/character';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const nameParam = searchParams.get('name');

    if (!nameParam) {
      return responseBadRequest();
    }

    const name = decodeURI(nameParam);

    const data = await fetchAndSaveCharacter(name);

    return responseSuccess({ ...data });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('UNDEFINED_CHARACTER')) {
        return responseBadRequest('캐릭터를 찾을 수 없습니다.');
      }
      if (error.message.startsWith('UNDEFINED_BASIC_DATA')) {
        return responseBadRequest('캐릭터의 정보를 조회 할 수 없습니다.');
      }

      if (error.message.startsWith('COOLDOWN_ACTIVE')) {
        return responseBadRequest('갱신은 5분에 1번만 가능합니다.');
      }
    }

    let errorMessage = '캐릭터 갱신에 실패 했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return responseBadRequest(errorMessage);
  }
}
