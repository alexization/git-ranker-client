# CONVENTIONS.md

`git-ranker-client` 코드 작성 규약이다. 구조는 [STRUCTURE.md](STRUCTURE.md)를 본다.

## 파일·import

- 파일명은 kebab-case (`ranking-service.ts`, `user-detail-modal.tsx`).
- import는 `@/*` alias (`./src/*`) 사용.

## 컴포넌트

- Server Component가 기본. 상호작용이 필요한 컴포넌트만 `"use client"`를 선언한다.
- React Compiler가 활성화되어 있다(`babel-plugin-react-compiler`). 수동 `memo`/`useCallback` 최적화를 새로 추가하기 전에 컴파일러가 처리하는지 먼저 판단하고, `react-hooks/*` lint 경고를 따른다.
- 컴포넌트 변형은 `class-variance-authority`, 클래스 병합은 `cn()`(clsx + tailwind-merge).

## 데이터 페칭·상태

- 전송 계층은 `shared/lib/api-client.ts`의 단일 axios 인스턴스만 사용한다. 응답 인터셉터가 `{result, data, error}` envelope를 언래핑하고 실패 시 `ApiError`를 던지므로, **raw envelope를 기대하는 코드를 쓰지 않는다**. 401은 자동 refresh(`/auth/refresh`) 후 재시도되고, refresh 실패 시 로그아웃·`/login` 리다이렉트된다.
- 서버 측 조회는 React `cache()`로 래핑한 fetcher, 클라이언트 측은 react-query v5 훅(`useQuery`)을 같은 `*-service.ts`에 콜로케이션한다.
- 클라이언트 전역 상태는 Zustand. 영속이 필요하면 `persist` 미들웨어(예: `auth-store`의 localStorage `auth-storage`). 하이드레이션 안전성은 `useAuthHydrated` 패턴을 따른다.

## 백엔드 API 계약 동기화

`shared/types/api.ts`는 백엔드 OpenAPI 계약의 **수동 미러**다. 백엔드 API가 바뀌는 작업에서는:

1. 백엔드(`git-ranker`)의 controller/dto 변경을 확인한다.
2. `shared/types/api.ts`의 해당 타입을 함께 갱신한다.
3. `npm run typecheck`로 사용처 전체가 새 계약과 정렬됐는지 확인한다.

## 스타일링

- Tailwind CSS v3 (`darkMode: "class"`), 테마 토큰은 CSS 변수 HSL(`--background`, `--primary` 등).
- 폰트는 CSS 변수 `--font-sans`(Pretendard), `--font-mono`(JetBrains Mono).
- 애니메이션은 `tailwindcss-animate` + framer-motion. `use-reduced-motion` 훅으로 모션 감소 설정을 존중한다.

## i18n

- locale은 en/ko, 기본 en. 라우팅은 `src/proxy.ts`가 담당하므로 컴포넌트에서 locale prefix를 직접 다루지 않는다.
- 문자열은 `shared/i18n/messages/{en,ko}.ts`에 추가하고 `useI18n()`(client) / `server-locale.ts`(server)로 읽는다. 하드코딩 문자열을 남기지 않는다.

## 환경 변수

- 빌드·런타임은 absolute URL의 `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`을 요구한다. public env 접근은 `shared/lib/public-env.ts`를 거친다.
- 로컬 Next 명령은 `.env.local`, Docker Compose는 `.env`를 읽는다. 시작값은 `.env.example`.
