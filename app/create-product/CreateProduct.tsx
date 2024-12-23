'use client'
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createProduct, ProductData } from "@/app/api/productService";
import { useToast } from "@/hooks/use-toast";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const sellerId = "31f34892-2a52-4865-8a0b-dc297026cdbb"; // Example seller ID

    const productData = {
      productName,
      quantity,
      price,
      description,
      sellerId,
      productImages,
    };

    try {
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
      setProductImages([]);
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
                <Input
                  type="text"
                  value={productImages.join(", ")}
                  onChange={(e) => setProductImages(e.target.value.split(", "))}
                  placeholder="Image URLs (comma separated)"
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
        </div>
      </div>
    </div>
  );
};

export default CreateProduct; 