import UserViewPage from '../_components/user-view-page';

export const metadata = {
  title: 'Dashboard : Employee View',
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page({ params }: PageProps) {
  try {
    // Resolve params to get the userId
    const resolvedParams = await params;

    return <UserViewPage params={resolvedParams} />;
  } catch (error) {
    console.error('Error resolving params:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load the page. Please try again later.</p>
      </div>
    );
  }
}
