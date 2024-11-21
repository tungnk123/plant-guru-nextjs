import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";



const CreatePost = () => {
  const [backgroundColor, setBackgroundColor] = useState("#FFFF00");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Post submitted!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      alert(`Selected Image: ${e.target.files[0].name}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">Create post</h1>
      <p className="text-center text-gray-600 mb-8">
        Create a plant post and share it with the community
      </p>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Section - Form */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Create Your Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-2 font-semibold">Title</label>
                <Input type="text" placeholder="Title" />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-semibold">Description</label>
                <Textarea placeholder="Describe your plant..." />
              </div>

              {/* Plant Images */}
              <div>
                <label className="block mb-2 font-semibold">Plant Images</label>
                <div
                  className="border border-dashed p-4 rounded text-center mb-4 cursor-pointer"
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  <span className="text-gray-500">
                    {selectedImage ? selectedImage.name : "+"}
                  </span>
                </div>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 font-semibold">Tags</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="plants">Plants</SelectItem>
                    <SelectItem value="flowers">Flowers</SelectItem>
                    <SelectItem value="sell-trade">Sell & Trade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background */}
              <div>
                <label className="block mb-2 font-semibold">Background</label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
              </div>

              {/* Post Button */}
              <Button type="submit" className="w-full">
                Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Section */}
        <div className="space-y-4">
          {/* Help Box */}
          <Card>
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm mb-4">
                Create a plant post and share it with the community.
              </p>
              <Link href="/community">
                <Button variant="outline">Ask Community</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Common Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Common Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center bg-gray-100 p-2 rounded">
                  <span>🌍</span>
                  <span className="ml-2">All Categories</span>
                </div>
                <div className="flex items-center bg-green-100 p-2 rounded">
                  <span>🌱</span>
                  <span className="ml-2">Plants</span>
                </div>
                <div className="flex items-center bg-yellow-100 p-2 rounded">
                  <span>🌸</span>
                  <span className="ml-2">Flowers</span>
                </div>
                <div className="flex items-center bg-red-100 p-2 rounded">
                  <span>💰</span>
                  <span className="ml-2">Sell & Trade</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
