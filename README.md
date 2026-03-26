# git-ranker-client

`git-ranker-client`는 Git Ranker의 Next.js 16 프런트엔드다. 랭킹 조회, 사용자 상세, 로그인 진입, SEO 메타데이터와 배지 링크를 제공한다.

## Requirements

- Node.js 20+
- npm
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_URL`

`NEXT_PUBLIC_BASE_URL`와 `NEXT_PUBLIC_API_URL`는 build와 runtime 모두에서 필수다. 값이 없으면 `npm run build`와 런타임 초기화가 즉시 실패한다.

## Environment

로컬 Next.js 실행은 `.env.local`, Docker Compose 실행은 `.env`를 사용하면 된다. 시작점으로는 [.env.example](.env.example)을 복사한다.

로컬 개발 예시:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

프로덕션 예시:

```env
NEXT_PUBLIC_BASE_URL=https://www.git-ranker.com
NEXT_PUBLIC_API_URL=https://www.git-ranker.com
```

선택 env:

- `NEXT_PUBLIC_ANALYTICS_ENDPOINT`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`

선택 env가 없어도 핵심 기능은 동작한다. 없으면 analytics/web vitals 전송이나 Sentry 수집만 비활성화된다.

## Commands

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

`docker-compose.yml`과 `Dockerfile`은 `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`가 비어 있으면 즉시 실패한다.

## Build And Runtime Notes

- `JetBrains Mono`는 공식 JetBrains Mono release v2.304에서 가져온 로컬 자산을 사용한다.
- 폰트 라이선스는 [src/fonts/JetBrainsMono-OFL.txt](src/fonts/JetBrainsMono-OFL.txt)에 보관한다.
- locale routing과 보안 헤더는 [src/proxy.ts](src/proxy.ts)에서 처리한다.
- public URL 정책은 [src/shared/lib/public-env.ts](src/shared/lib/public-env.ts)에서 단일 기준으로 관리한다.
