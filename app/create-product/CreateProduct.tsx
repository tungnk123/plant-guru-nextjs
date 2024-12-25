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

    const userId = localStorage.getItem('userId'); // Get the user ID from local storage
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        selectedImages.map((image) => uploadImageToImgur(image))
      );

      const productData = {
        productName,
        quantity,
        price,
        description,
        sellerId: userId, // Use the real user ID
        productImages: uploadedImages,
      };

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
    } catch (error: any) {
      console.error("Error in form submission:", error);

      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold">Create Product</h1>
      <p className="mb-8 text-center text-gray-600">
        Create a new product and add it to your store
      </p>

      <div className="grid grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Create Your Product</CardTitle>
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
                {loading ? "Creating..." : "Create Product"}
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
                Create a product and add it to your store.
              </p>
              <Link href="/community">
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

export default CreateProduct; 