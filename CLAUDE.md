# CLAUDE.md

`git-ranker-client`는 Git Ranker의 Next.js 16 프런트엔드다. umbrella 저장소(`git-ranker-workflow`)는 cross-repo 진입점만 소유하고, 프런트엔드 구현 판단의 canonical source는 이 저장소 안에 둔다.

## Start Order

1. [README.md](README.md)에서 프로젝트 overview만 확인한다.
2. [docs/verification-contract.md](docs/verification-contract.md), [package.json](package.json), [.env.example](.env.example)에서 verification command와 required public env를 확인한다.
3. [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml)에서 retained CI/deploy gate를 확인한다.
4. [next.config.ts](next.config.ts), [tsconfig.json](tsconfig.json), [eslint.config.mjs](eslint.config.mjs), [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml)에서 build/runtime config surface를 확인한다.
5. [src/app](src/app), [src/features](src/features), [src/shared](src/shared), [src/proxy.ts](src/proxy.ts)에서 route, feature, shared runtime ownership을 따라간다.

## Source Of Truth

- [README.md](README.md): 프로젝트 overview-only surface
- [docs/verification-contract.md](docs/verification-contract.md): lint/typecheck/build contract와 결과 해석 기준
- [package.json](package.json): npm command surface
- [.env.example](.env.example): required public env baseline
- [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/deploy.yml](.github/workflows/deploy.yml): retained CI/deploy gate
- [next.config.ts](next.config.ts), [tsconfig.json](tsconfig.json), [eslint.config.mjs](eslint.config.mjs): build/static analysis config
- [src/app](src/app), [src/features](src/features), [src/shared](src/shared), [src/proxy.ts](src/proxy.ts): app behavior canonical source

## Operational Rules

- repo-local docs, config, code가 umbrella repo 문서보다 우선한다.
- root `README.md`는 overview만 맡고, concrete bootstrap과 execution guidance는 `CLAUDE.md`와 named entry docs가 소유한다.
- verification baseline은 `npm run lint`, `npm run typecheck`, `npm run build`다.
- `.github/workflows/ci.yml`는 같은 baseline order를 그대로 실행해야 한다.
- `npm run build`와 runtime bootstrap은 absolute URL로 설정된 `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`를 요구한다.
- local Next.js 명령은 `.env.local`, Docker Compose는 `.env`를 사용하며 시작값은 `.env.example`에서 가져온다.
- repo-local `.claude/skills/`는 현재 없으므로 first source는 `CLAUDE.md`와 nearest docs/config/code surface다.
- verification contract나 deploy gate가 바뀌면 `docs/verification-contract.md`, `package.json`, workflow, `CLAUDE.md`를 함께 갱신한다.

## Guard

- `.claude/hooks/block-dangerous.sh`: Claude 세션 안에서 destructive 명령(rm -rf, force push, reset --hard 등)을 차단한다.
