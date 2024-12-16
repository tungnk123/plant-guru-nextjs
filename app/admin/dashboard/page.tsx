import { redirect } from 'next/navigation';

const Dashboard = () => {
  redirect('/admin/dashboard/overview');

  return null;
};

export default Dashboard;
