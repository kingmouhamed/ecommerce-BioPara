// حل مشكلة TypeScript مع ملفات CSS
declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
