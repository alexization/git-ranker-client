# CLAUDE.md

`git-ranker-client`는 Git Ranker의 Next.js 16 프런트엔드다. umbrella 저장소(`git-ranker-workflow`)는 cross-repo 진입점만 소유하고, 프런트엔드 구현 판단의 canonical source는 이 저장소 안에 둔다.

## Start Order

1. [README.md](README.md)에서 프로젝트 overview만 확인한다.
2. [docs/STRUCTURE.md](docs/STRUCTURE.md)에서 app/features/shared 3계층 구조를, [docs/CONVENTIONS.md](docs/CONVENTIONS.md)에서 코드 작성 규약을 확인한다.
3. [docs/verification-contract.md](docs/verification-contract.md), [package.json](package.json), [.env.example](.env.example)에서 verification command와 required public env를 확인한다.
4. [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml)에서 retained CI/deploy gate를 확인한다.
5. [next.config.ts](next.config.ts), [tsconfig.json](tsconfig.json), [eslint.config.mjs](eslint.config.mjs), [tailwind.config.ts](tailwind.config.ts), [postcss.config.mjs](postcss.config.mjs), [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml)에서 build/runtime config surface를 확인한다.
6. [src/app](src/app), [src/features](src/features), [src/shared](src/shared), [src/proxy.ts](src/proxy.ts)에서 route, feature, shared runtime ownership을 따라간다.

## Source Of Truth

- [README.md](README.md): 프로젝트 overview-only surface
- [docs/STRUCTURE.md](docs/STRUCTURE.md): src 3계층 구조와 라우트/슬라이스 맵
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md): 코드 작성 규약 (컴포넌트, 데이터 페칭, API 계약 동기화, i18n)
- [docs/verification-contract.md](docs/verification-contract.md): lint/typecheck/build contract와 결과 해석 기준
- [package.json](package.json): npm command surface
- [.env.example](.env.example): required public env baseline
- [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml): retained CI/deploy gate
- [next.config.ts](next.config.ts), [tsconfig.json](tsconfig.json), [eslint.config.mjs](eslint.config.mjs), [tailwind.config.ts](tailwind.config.ts), [postcss.config.mjs](postcss.config.mjs): build/static analysis config
- [src/app](src/app), [src/features](src/features), [src/shared](src/shared), [src/proxy.ts](src/proxy.ts): app behavior canonical source

## Operational Rules

- repo-local docs, config, code가 umbrella repo 문서보다 우선한다.
- root `README.md`는 overview만 맡고, concrete bootstrap과 execution guidance는 `CLAUDE.md`와 named entry docs가 소유한다.
- verification baseline은 `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`다.
- `.github/workflows/ci.yml`는 같은 baseline order를 그대로 실행해야 한다.
- `npm run build`와 runtime bootstrap은 absolute URL로 설정된 `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`를 요구한다.
- local Next.js 명령은 `.env.local`, Docker Compose는 `.env`를 사용하며 시작값은 `.env.example`에서 가져온다.
- verification contract나 deploy gate가 바뀌면 `docs/verification-contract.md`, `package.json`, workflow, `CLAUDE.md`를 함께 갱신한다.

## Skills

`.claude/skills/`는 ECC(MIT — [affaan-m/ECC](https://github.com/affaan-m/ECC))에서 선별한 지식 스킬로 구성된다: `react-patterns`(React 19 훅·서버/클라이언트 경계), `react-performance`(성능 규칙), `nextjs-turbopack`(Next.js 16), `frontend-a11y`(접근성). 해당 영역 작업 시 자동 참조된다. 현재 테스트는 순수 로직 단위 테스트(vitest)만 있어 컴포넌트/E2E testing 계열 스킬은 두지 않았다(도입 시 `react-testing`/`e2e-testing` 추가 검토).

## Guard

- `.claude/hooks/block-dangerous.sh`: Claude 세션 안에서 destructive 명령(rm -rf, force push, reset --hard 등)을 차단한다.
