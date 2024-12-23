import { Metadata } from 'next';
import SignInViewPage from '../_components/sigin-view';
import { useRouter } from 'next/router';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default function Page() {
  const router = useRouter();

  return <SignInViewPage />;
}
