import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts, ProductData } from '@/app/api/productService';

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const products = await fetchProducts();
          const selectedProduct = products.find((p) => p.id === productId);
          setProduct(selectedProduct || null);
        } catch (error) {
          console.error('Failed to load product:', error);
        }
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.productName}</h1>
      <img src={product.productImages[0] || '/placeholder.png'} alt={product.productName} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={() => alert('Buy Now functionality not implemented yet')}>Buy Now</button>
    </div>
  );
};

export default ProductDetail; 