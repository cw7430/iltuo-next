import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';

import '@/styles/style.css';
import '@/styles/responsive.css';
import '@/styles/jquery.mCustomScrollbar.min.css';
import { me } from '@/features/user/request/server/models';
import { ReactQueryProvider, Progressbar } from '@/common/components/layouts';
import { AuthInitializer } from '@/features/user/components/layouts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '일투오',
  description: 'Iltuo Coffee',
  icons: {
    icon: './svg/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const checkAccessToken = await me();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ReactQueryProvider>
          <AuthInitializer checkAccessToken={checkAccessToken} />
          <Progressbar>{children}</Progressbar>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
