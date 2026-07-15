# STRUCTURE.md

`git-ranker-client`의 프로젝트 구조 가이드다. Next.js 16(App Router) / React 19 / TypeScript. `src/`는 `app`(라우트) / `features`(기능 슬라이스) / `shared`(공용) 3계층으로 나뉜다.

## src/app — 라우트

모든 라우트는 `src/proxy.ts`가 locale prefix(`/en`, `/ko`)를 처리한다. 폴더 구조에는 `[locale]` 세그먼트가 없다.

| 라우트 | 파일 | 비고 |
|---|---|---|
| `/` | `page.tsx` | 홈 (server component) |
| `/ranking` | `ranking/{page,layout,loading}.tsx` | 랭킹 리스트 |
| `/users/[username]` | `users/[username]/{page,loading,opengraph-image}.tsx` + `user-profile-client.tsx` | 사용자 상세, 동적 OG 이미지 |
| `/login` | `login/{page,layout}.tsx` | 로그인 진입 |
| `/settings` | `settings/page.tsx` | 설정 (계정 삭제 포함) |
| `/auth/callback`, `/oauth2/redirect` | 각 `page.tsx` | OAuth 콜백 처리 |
| 시스템 | `error.tsx`, `global-error.tsx`, `not-found.tsx` | |
| SEO | `manifest.ts`, `robots.ts`, `sitemap.ts` | 메타데이터 route handler |

`layout.tsx`(root)는 폰트(Pretendard/JetBrains Mono), 다국어 SEO 메타데이터, GA, 그리고 provider 스택(`ThemeProvider > LocaleProvider > QueryProvider > AuthProvider`)을 구성한다.

## src/features — 기능 슬라이스

각 슬라이스는 내부에 `api/`, `components/`, `store/`를 가진다 (없는 폴더는 생략).

| 슬라이스 | 구성 |
|---|---|
| `auth/` | `api/auth-service.ts`, `store/auth-store.ts` |
| `home/` | `components/hero-section.tsx`, `store/search-store.ts` |
| `ranking/` | `api/ranking-service.ts`, `components/ranking-section.tsx` |
| `user/` | `api/user-service.ts` + `components/`(activity-grid, badge-generator, stats-chart, score-info-modal, user-detail-modal, delete-account-modal 등) |

`api/*-service.ts`는 서버용 fetcher(React `cache()` 래핑)와 클라이언트용 react-query 훅(`use*`)을 한 파일에 콜로케이션한다. 기능 전용 훅은 service/component 파일 안에 두고, 범용 훅만 `shared/hooks`에 둔다.

## src/shared — 공용 계층

- `components/`: shadcn/Radix 스타일 프리미티브(button, card, dialog...), `layout/header.tsx`, `ui/`(heatmap-background, live-ticker, tilt-card)
- `lib/`: `api-client.ts`(axios 인스턴스 — CONVENTIONS.md 참고), `analytics.ts`, `public-env.ts`, `validations.ts`, `utils.ts`(`cn`)
- `providers/`: auth / locale(`useI18n`) / query / theme
- `hooks/`: use-media-query, use-reduced-motion 등 범용 훅
- `i18n/`: `config.ts`(en/ko, 기본 en, 쿠키 `git-ranker.locale`), `messages/{en,ko}.ts`
- `constants/tier-styles.ts`: 티어 순서·색상 헬퍼
- `types/api.ts`: 백엔드 API 계약의 수동 TypeScript 미러 (갱신 절차는 CONVENTIONS.md)

## src/proxy.ts — 미들웨어

두 가지 책임: (1) locale 라우팅 — 경로/쿠키/accept-language로 locale을 판별해 `/{locale}/...`로 리다이렉트하고, 내부 경로로 rewrite하며 `x-locale` 헤더와 쿠키를 주입, (2) 보안 헤더 — CSP, Referrer-Policy, Permissions-Policy를 모든 응답에 적용. `/_next`, `/api`, `/oauth2`, 정적 파일은 우회한다.

## 테스트

테스트 스위트는 없다. 검증 베이스라인은 `npm run lint` → `npm run typecheck` → `npm run build`이며 계약은 [verification-contract.md](verification-contract.md)가 소유한다.
