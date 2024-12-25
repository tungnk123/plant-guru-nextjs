import MembershipViewPage from '../_components/membership-view-page';

export const metadata = {
  title: 'Dashboard : Membership View',
};

export default function Page({ params }: { params: { membershipId: string } }) {
  console.log('Membership ID (Server):', params.membershipId);

  if (!params.membershipId) {
    return <div>Error: Membership ID is missing</div>;
  }

  return (
    <MembershipViewPage
      params={{
        membershipId: params.membershipId,
      }}
    />
  );
}
