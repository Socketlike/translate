import { build, defineConfig } from 'tsup'

await build(
  defineConfig({
    bundle: true,
    dts: true,
    entry: ['src/index.ts'],
    format: 'cjs',
    minify: true,
    outDir: 'dist',
    platform: 'node',
    splitting: false,
    tsconfig: './tsconfig.json',
  }),
)
