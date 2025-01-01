import { ScrollArea } from '@/components/ui/scroll-area';
import OrderForm from './orders-form';
import PageContainer from '@/components-admin/layout/page-container';

export default function OrderViewPage() {
  return (
    <PageContainer>
      <OrderForm />
    </PageContainer>
  );
}
