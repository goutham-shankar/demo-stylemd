// Allow importing CSS files in TypeScript files (side-effect imports)
declare module '*.css';

// Next.js inlines NEXT_PUBLIC_* env vars at build time
declare const process: { env: { [key: string]: string | undefined } };
declare module '*.scss';
declare module '*.module.css';
declare module '*.module.scss';

declare module '*.svg' {
  const src: string;
  export default src;
}
