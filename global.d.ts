// Allow importing CSS files in TypeScript files (side-effect imports)
declare module '*.css';
declare module '*.scss';
declare module '*.module.css';
declare module '*.module.scss';

declare module '*.svg' {
  const src: string;
  export default src;
}
