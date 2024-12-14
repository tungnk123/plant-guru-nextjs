import FormCardSkeleton from '@/components-admin/form-card-skeleton';
import PageContainer from '@/components-admin/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '../_components/product-view-page';

export const metadata = {
  title: 'Dashboard : Product View'
};

type PageProps = { params: { productId: string } };

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage productId={params.productId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
