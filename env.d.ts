export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_APP_ENV: 'local' | 'development' | 'production';
      readonly NEXT_PUBLIC_API_URL: string;
    }
  }
}
