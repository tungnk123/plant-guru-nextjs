import { ScrollArea } from '@/components/ui/scroll-area';
import EmployeeForm from './employee-form';
import PageContainer from '@/components-admin/layout/page-container';

export default function EmployeeViewPage() {
  return (
    <PageContainer>
      <EmployeeForm />
    </PageContainer>
  );
}
