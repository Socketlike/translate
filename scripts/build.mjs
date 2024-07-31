import { build, defineConfig } from 'tsup'

await build(
  defineConfig({
    bundle: true,
    dts: true,
    entry: ['src/index.ts'],
    format: 'cjs',
    minify: false,
    outDir: 'dist',
    platform: 'neutral',
    splitting: false,
    skipNodeModulesBundle: true,
    tsconfig: './tsconfig.json',
  }),
)
