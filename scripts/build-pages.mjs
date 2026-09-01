#!/usr/bin/env node
/**
 * Cloudflare Pages 통합 빌드 스크립트
 * 
 * 1. React SPA를 빌드 → deploy/ 정적 파일
 * 2. Hono API를 _worker.js로 번들 → deploy/_worker.js
 * 3. _routes.json 생성 → API 요청만 _worker.js로 라우팅
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEPLOY_DIR = resolve(ROOT, 'deploy');

console.log('🔨 [1/4] React SPA 빌드...');
execSync('pnpm --filter @osaekwoon/web build', { cwd: ROOT, stdio: 'inherit' });

console.log('📦 [2/4] deploy/ 디렉토리 준비...');
if (existsSync(DEPLOY_DIR)) {
  rmSync(DEPLOY_DIR, { recursive: true });
}
mkdirSync(DEPLOY_DIR, { recursive: true });

// React SPA 빌드 결과물 복사
cpSync(resolve(ROOT, 'apps/web/dist'), DEPLOY_DIR, { recursive: true });

console.log('⚡ [3/4] Hono API → _worker.js 번들...');
execSync(
  `npx esbuild apps/api/src/index.ts \
    --bundle \
    --format=esm \
    --target=es2022 \
    --platform=browser \
    --conditions=workerd,worker,browser \
    --outfile=deploy/_worker.js \
    --minify \
    --alias:@osaekwoon/shared=./packages/shared/src/index.ts \
    --external:cloudflare:* \
    --external:node:*`,
  { cwd: ROOT, stdio: 'inherit' }
);

console.log('📄 [4/4] _routes.json 생성...');
// /api/* 요청만 _worker.js로 라우팅, 나머지는 정적 파일 서빙
const routesJson = {
  version: 1,
  include: ["/api/*"],
  exclude: []
};
writeFileSync(resolve(DEPLOY_DIR, '_routes.json'), JSON.stringify(routesJson, null, 2));

// SPA fallback을 위해 index.html이 모든 비-API 경로를 처리하도록 설정
// Cloudflare Pages는 자동으로 SPA fallback을 지원함

console.log('');
console.log('✅ 빌드 완료!');
console.log(`   📁 deploy/ 디렉토리 준비됨`);
console.log(`   🌐 정적 파일: React SPA`);
console.log(`   ⚡ _worker.js: Hono API`);
console.log(`   📋 _routes.json: /api/* → Worker`);
