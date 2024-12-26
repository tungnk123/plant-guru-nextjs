'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, PostData } from '@/app/api/postService';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToImgur } from '@/app/api/imgurService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tagOptions = {
  allCategory: "All Categories",
  plants: "Plants",
  flowers: "Flowers",
  guides: "Guides & Tips",
  diseases: "Diseases",
  qna: "Q&A",
  diy: "DIY Projects",
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("allCategory");
  const [backgroundColor, setBackgroundColor] = useState("#FFFF00");
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

      const postData: PostData = {
        title,
        description,
        userId,
        images,
        tag,
        background: backgroundColor,
      };
      console.log(postData);

      const data = await createPost(postData);
      console.log("Post created successfully:", data);

      toast({
        title: "Post Created",
        description: "Your plant post has been successfully created!",
        variant: "success"
      });

      setTitle("");
      setDescription("");
      setTag("allCategory");
      setBackgroundColor("#FFFF00");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the post.",
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
            <CardTitle>Create a New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your post..."
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

              <div>
                <label className="mb-2 block font-semibold">Tags</label>
                <Select value={tag} onValueChange={(value) => setTag(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tagOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Post"}
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
              Create a post and share it with the community.
            </p>
            <Button variant="outline">Ask Community</Button>
          </CardContent>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center rounded bg-gray-100 p-2">
                <span role="img" aria-label="All Categories">
                  🌍
                </span>
                <span className="ml-2">All Categories</span>
              </div>
              <div className="flex items-center rounded bg-green-100 p-2">
                <span role="img" aria-label="Plants">
                  🌱
                </span>
                <span className="ml-2">Plants</span>
              </div>
              <div className="flex items-center rounded bg-yellow-100 p-2">
                <span role="img" aria-label="Flowers">
                  🌸
                </span>
                <span className="ml-2">Flowers</span>
              </div>
              <div className="flex items-center rounded bg-red-100 p-2">
                <span role="img" aria-label="Sell & Trade">
                  💰
                </span>
                <span className="ml-2">Sell & Trade</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => router.back()} variant="outline" className="w-full">
          Back
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
