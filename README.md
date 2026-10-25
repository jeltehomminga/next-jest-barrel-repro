# next/jest doesn't apply optimizePackageImports

`@mui/material` is in Next.js's default `optimizePackageImports` list. `next dev` and `next build` rewrite `import { Button } from '@mui/material'` so only `Button` is loaded. Jest set up through `next/jest` does not, so every test file that imports from the barrel loads the whole package.

## Run it

```bash
npm install
npm test                                  # all 5 tests pass
COUNT_MODULES=1 npx jest -i __tests__/barrel.test    # files loaded per @mui package
scripts/bench.sh barrel 50                # 50 copies of one test file, timed
scripts/bench.sh direct 50
JEST_ARGS=-i scripts/bench.sh barrel 50   # same, one worker
```

## Tests

| File | Import |
| --- | --- |
| `__tests__/barrel.test.tsx` | `import { Button } from '@mui/material'` |
| `__tests__/direct.test.tsx` | `import Button from '@mui/material/Button'` |
| `__tests__/icons-barrel.test.tsx` | `import { Home } from '@mui/icons-material'` |
| `__tests__/icons-direct.test.tsx` | `import Home from '@mui/icons-material/Home'` |
| `__tests__/theme-barrel.test.tsx` | `import { Button, ThemeProvider, createTheme } from '@mui/material'` |

`app/page.tsx` uses the same imports as `theme-barrel.test.tsx`.

## Results

next 16.5.0-canary.27, jest 30.5.2, @mui/material 9.5.0, Node 24.21.0, macOS arm64 with 15 cores.

Files resolved under `node_modules/@mui/material` (`COUNT_MODULES=1`):

| Test | Files |
| --- | --- |
| barrel | 567 |
| direct | 81 |
| barrel with `MUI_MODULARIZE=1` | 81 |
| theme-barrel | 567 |
| icons-barrel / icons-direct | 44 / 44 (and 2 / 2 under `@mui/icons-material`) |

Wall time for 50 copies of one test file, `--no-cache`, 3 runs (all workers) or 2 runs (`-i`):

| Run | barrel | direct |
| --- | --- | --- |
| all workers | 2244, 1979, 1969 ms | 1516, 1467, 1496 ms |
| `-i` | 3511, 3506 ms | 2402, 2278 ms |

The icons pair matches because `@mui/icons-material` is also in Next's default `modularizeImports`, and `next/jest` does pass `modularizeImports` to its SWC transform.

On the build side, `next dev --webpack` with no `next.config` changes rewrites the page's import to `__barrel_optimize__?names=Button,ThemeProvider,createTheme!=!@mui/material`. `next build` (Turbopack) and `next build --webpack` both build the page.

## The modularizeImports workaround

`MUI_MODULARIZE=1` turns on this entry in `next.config.ts`:

```ts
modularizeImports: {
  "@mui/material": { transform: "@mui/material/{{member}}" },
}
```

It brings `barrel.test.tsx` down to the same 81 files as `direct.test.tsx`. It breaks `theme-barrel.test.tsx`, because `ThemeProvider` and `createTheme` are exported from the root barrel but have no `@mui/material/<Name>` path:

```
Cannot find module '@mui/material/ThemeProvider' from '__tests__/theme-barrel.test.tsx'
```

`optimizePackageImports` handles these names in `next dev` and `next build` because it reads the barrel's real export map.
