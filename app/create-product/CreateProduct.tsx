'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  HelpCircle, 
  ArrowLeft, 
  ImageIcon,
  DollarSign,
  Package,
  FileText,
  Loader2,
  X
} from "lucide-react";
import { createProduct } from "@/app/api/productService";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto py-12 px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full 
            bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium">
            Create Product
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 
            to-teal-600 bg-clip-text text-transparent mt-2">
            List Your Product
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Share your products with the community and start selling today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r 
                from-transparent via-green-500/20 to-transparent" />
              
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 
                    to-emerald-600 bg-clip-text text-transparent">
                    Product Details
                  </CardTitle>
                </div>
                <CardDescription>
                  Fill in the information about your product
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Product Name
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 
                        to-emerald-100 text-green-700">
                        Required
                      </Badge>
                    </label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      className="h-11 border-gray-200 focus:ring-green-500 
                        focus:border-green-500 transition-all"
                      required
                    />
                  </div>

                  {/* Quantity and Price Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Quantity
                        <Package className="w-4 h-4 text-gray-400" />
                      </label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Enter quantity"
                        className="h-11 border-gray-200 focus:ring-green-500 
                          focus:border-green-500 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Price
                        <DollarSign className="w-4 h-4 text-gray-400" />
                      </label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="Enter price"
                        className="h-11 border-gray-200 focus:ring-green-500 
                          focus:border-green-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Description
                      <FileText className="w-4 h-4 text-gray-400" />
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                      className="min-h-[120px] border-gray-200 focus:ring-green-500 
                        focus:border-green-500 transition-all"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Images
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 
                        to-emerald-100 text-green-700">
                        {imagePreviews.length}/6
                      </Badge>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={preview}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover transition-transform 
                              duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 
                            group-hover:opacity-100 transition-all duration-300 
                            flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="rounded-full"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}

                      {imagePreviews.length < 6 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="aspect-square rounded-xl border-2 border-dashed 
                            border-gray-300 hover:border-green-500 transition-all duration-300 
                            cursor-pointer bg-gradient-to-br from-gray-50 to-white
                            hover:from-green-50 hover:to-emerald-50
                            flex flex-col items-center justify-center gap-2 group"
                          onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                          <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 
                            to-gray-200 group-hover:from-green-100 group-hover:to-emerald-100 
                            transition-colors duration-300">
                            <ImageIcon className="w-6 h-6 text-gray-400 
                              group-hover:text-green-600 transition-colors duration-300" />
                          </div>
                          <span className="text-sm text-gray-500 group-hover:text-green-600 
                            transition-colors duration-300">
                            Add Photos
                          </span>
                        </motion.div>
                      )}
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 
                      hover:from-green-700 hover:to-emerald-700 text-white shadow-lg 
                      hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Product...</span>
                      </div>
                    ) : (
                      <span>Create Product</span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="space-y-4">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <HelpCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-green-600 
                    to-emerald-600 bg-clip-text text-transparent">
                    Need Help?
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Create a product and add it to your store.
                </p>
                <Link href="/create-post">
                  <Button variant="outline" className="w-full border-green-200 
                    hover:bg-green-50 transition-all duration-300">
                    Ask Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full group border-green-200 hover:bg-green-50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;