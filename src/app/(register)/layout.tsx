import { redirect } from 'next/navigation';

import { Footer } from '@/common/components/layouts';
import { me } from '@/features/user/request/server/models';

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const checkLogin = await me();
  if (checkLogin) {
    redirect('/', 'replace');
  }

  return (
    <>
      {children}
      <Footer />
    </>
  );
}
