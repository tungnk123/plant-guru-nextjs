import { ScrollArea } from '@/components/ui/scroll-area';
import PostForm from './post-form';
import PageContainer from '@/components-admin/layout/page-container';

export default function PostViewPage() {
  return (
    <PageContainer>
      <PostForm />
    </PageContainer>
  );
}
