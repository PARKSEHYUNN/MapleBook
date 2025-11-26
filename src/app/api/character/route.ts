// src/app/api/character/route.ts
import { responseBadRequest, responseSuccess } from '@/lib/api/response';
import { prisma } from '@/lib/config/db';
import { fetchAndSaveCharacter } from '@/lib/services/character';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

const EXPIRED_CHARACTER_DATA_MS = 30 * 24 * 60 * 60 * 1000; // 30일

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const nameParam = searchParams.get('name');

    if (!nameParam) {
      return responseBadRequest();
    }

    const name = decodeURI(nameParam);

    const characterData = await prisma.character.findFirst({
      where: { character_name: name },
    });

    // 갱신 시간이 오래됬을때 강제 갱신
    let isLastFetchAt = false;

    if (characterData) {
      const nowMs = new Date().getTime();
      const lastFetchedAtMs = new Date(characterData.lastFetchedAt).getTime();
      const elapsedMs = nowMs - lastFetchedAtMs;

      if (elapsedMs >= EXPIRED_CHARACTER_DATA_MS) {
        isLastFetchAt = true;
      }
    }

    if (!characterData || isLastFetchAt) {
      const newData = await fetchAndSaveCharacter(name);
      revalidatePath(`/user/${name}`);

      return responseSuccess({ ...newData });
    }

    return responseSuccess({ ...characterData });
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
