import UserViewPage from '../_components/user-view-page';

export const metadata = {
  title: 'Dashboard : Employee View'
};

export default function Page({ params }: { params: { userId: string } }) {
  return <UserViewPage params={params} />;
}
