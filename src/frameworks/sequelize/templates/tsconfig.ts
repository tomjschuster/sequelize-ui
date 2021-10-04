export function tsconfigTemplate(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true
  }
}
`
}
