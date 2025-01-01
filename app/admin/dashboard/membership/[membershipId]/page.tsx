import MembershipViewPage from '../_components/membership-view-page';

export const metadata = {
  title: 'Dashboard : Membership View',
};

interface PageProps {
  params: { membershipId: string };
}

// Resolve the Promise before using it in the client component
export default async function Page({ params }: { params: Promise<{ membershipId: string }> }) {
  const resolvedParams = await params; // Resolve the promise
  const { membershipId } = resolvedParams;

  return (
    <MembershipViewPage
      params={{
        membershipId,
      }}
    />
  );
}
