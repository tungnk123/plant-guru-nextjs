'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createProduct, ProductData } from "@/app/api/productService";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToImgur } from "@/app/api/imgurService";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }

      const images = await Promise.all(
        selectedImages.map((image) => uploadImageToImgur(image))
      );

      const productData = {
        productName,
        quantity,
        price,
        description,
        sellerId: userId,
        productImages: images,
      };
      console.log(productData);

      const data = await createProduct(productData);
      console.log("Product created successfully:", data);

      toast({
        title: "Product Created",
        description: "Your product has been successfully created!",
        variant: "success"
      });

      setProductName("");
      setQuantity(0);
      setPrice(0);
      setDescription("");
      setSelectedImages([]);
      setImagePreviews([]);

      // Redirect to profile page after successful creation
      router.push('/profile');
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the product.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold">Product Name</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Price</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price"
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
                <label className="mb-2 block font-semibold">Images</label>
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-auto w-full rounded object-cover"
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
                    className="flex h-[150px] w-full cursor-pointer items-center justify-center rounded border border-dashed p-4"
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
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-sm">
              Create a product and add it to your store.
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
  );
};

export default CreateProduct;