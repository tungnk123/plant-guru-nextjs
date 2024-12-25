'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BreadcrumbNavigation = ({ productName }: { productName?: string }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const isProductDetail = pathSegments.includes('products') && pathSegments.length === 2;
  const isConfirmation = pathSegments.includes('confirmation');

  return (
    <nav className="bg-gray-100 p-4 mb-6 rounded-lg shadow-sm">
      <div className="container mx-auto text-sm text-gray-700">
        <span className="text-green-500 hover:text-green-700 font-medium">
          <Link href="/products">Product</Link>
        </span>
        {isProductDetail && productName && (
          <>
            {' > '}
            <Link href={`/products/${pathSegments[1]}`}>
              <span className="text-green-500 hover:text-green-700 font-medium">{productName}</span>
            </Link>
          </>
        )}
        {isConfirmation && productName && (
          <>
            {' > '}
            <Link href={`/products/${pathSegments[2]}`}>
              <span className="text-green-500 hover:text-green-700 font-medium">{productName}</span>
            </Link>
            {' > '}
            <span className="text-gray-500 font-medium">Confirmation</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation; 