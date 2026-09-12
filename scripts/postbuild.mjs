import { copyFile, mkdir } from 'node:fs/promises'
await mkdir('dist', { recursive: true })
await copyFile('dist/index.html', 'dist/404.html')
console.log('Istante 4.0.0: 404 SPA fallback creato.')
