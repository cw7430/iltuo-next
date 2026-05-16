'use client';

import { AppProgressBar } from 'next-nprogress-bar';

export default function Progressbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppProgressBar
        height="4px"
        color="#ff0000"
        options={{ showSpinner: false }}
        shallowRouting={true}
      />
      {children}
    </>
  );
}
