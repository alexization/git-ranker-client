# Frontend Verification Contract

`git-ranker-client`의 verification contract는 repo-local command surface가 소유한다. workflow repo는 상위 `frontend-change` semantics만 가리키고, concrete command와 environment precondition은 이 문서와 repo config가 canonical source다.

## Required Environment

- Node.js `20+`
- `npm`
- dependency install 완료 상태 (`npm install` 또는 `npm ci`)
- absolute URL로 설정된 `NEXT_PUBLIC_BASE_URL`
- absolute URL로 설정된 `NEXT_PUBLIC_API_URL`

local Next.js 명령은 `.env.local`, Docker Compose는 `.env`를 읽는다. 시작점은 [.env.example](../.env.example)이며, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`가 비어 있거나 absolute URL이 아니면 build/runtime verification은 실패해야 한다.

## Commands

```bash
npm run lint
npm run typecheck
npm run build
```

- `npm run lint`
  - `eslint.config.mjs` 기준으로 Next.js / TypeScript lint surface를 검사한다.
- `npm run typecheck`
  - `tsconfig.json` 기준으로 `tsc --noEmit`를 실행한다.
  - `strict: true`, `noEmit: true`, path alias resolution이 깨지면 실패해야 한다.
- `npm run build`
  - `next build`를 실행한다.
  - production bundle, route tree, required public env contract를 함께 검증한다.

## Result Interpretation

- lint 실패:
  - ESLint rule 위반이나 React/Next static analysis regression이 생긴 상태다.
- typecheck 실패:
  - TypeScript contract, import path, generated type surface 중 하나가 깨진 상태다.
- build 실패:
  - Next.js production build, required public env, 또는 build-time code path 중 하나가 깨진 상태다.

## Current Notes

- `.github/workflows/ci.yml`는 `npm run lint`, `npm run typecheck`, `npm run build`를 같은 baseline order로 실행한다.
- CI build 단계는 placeholder absolute URL env를 주입해 required public env contract를 함께 검증한다.
- current repo-local baseline 기준 추가 GC follow-up risk는 없다.
