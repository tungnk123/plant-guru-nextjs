'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchProductById } from '@/app/api/productService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToImgur } from "@/app/api/imgurService";
import Link from 'next/link';
const EditProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id as string);
        setProductName(product.productName);
        setQuantity(product.quantity);
        setPrice(product.price);
        setDescription(product.description);
        setImagePreviews(product.productImages);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast({
          title: "Error",
          description: "Failed to load product data.",
          variant: "destructive",
        });
      }
    };

    loadProduct();
  }, [id, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = await Promise.all(
        selectedImages.map((image) => uploadImageToImgur(image))
      );

      const updatedProduct = {
        productName,
        quantity,
        price,
        description,
        productImages: [...imagePreviews, ...uploadedImages],
      };

    //   await updateProduct(id as string, updatedProduct);
      toast({
        title: "Product Updated",
        description: "Your product has been successfully updated!",
        variant: "success"
      });

      router.push('/profile');
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold">Edit Product</h1>
      <p className="mb-8 text-center text-gray-600">
        Update your product details
      </p>

      <div className="grid grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Edit Your Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold">Product Name</label>
                <Input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Quantity"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Price</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Price"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Product Images</label>
                <div className="mb-4 flex space-x-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-auto w-[300px] rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                  <div
                    className="flex h-[300px] w-[300px] cursor-pointer items-center justify-center rounded border border-dashed p-4"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    <PlusIcon className="text-gray-500" />
                  </div>
                </div>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-sm">
                Update your product details here.
              </p>
              <Link href="/create-post">
                <Button variant="outline">Ask Community</Button>
              </Link>
            </CardContent>
          </Card>
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 