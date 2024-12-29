import { ScrollArea } from '@/components/ui/scroll-area';
import WikiForm from './wiki-form';
import PageContainer from '@/components-admin/layout/page-container';

export default function WikiViewPage() {
  return (
    <PageContainer>
      <WikiForm />
    </PageContainer>
  );
}
