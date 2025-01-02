'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, PostData } from '@/app/api/postService';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToImgur } from '@/app/api/imgurService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, Sparkles, Camera, Loader2, HelpCircle, MessageCircle, ArrowLeft, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const tagOptions = [
  { 
    value: "allCategory", 
    label: "All Categories", 
    icon: "🌍", 
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-gray-200/50"
  },
  { 
    value: "plants", 
    label: "Plants", 
    icon: "🌱", 
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-200/50"
  },
  { 
    value: "flowers", 
    label: "Flowers", 
    icon: "🌸", 
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-200/50"
  },
  { 
    value: "guides", 
    label: "Guides & Tips", 
    icon: "📚", 
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-cyan-200/50"
  },
  { 
    value: "diseases", 
    label: "Diseases", 
    icon: "🔬", 
    color: "from-red-500 to-rose-600",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-200/50"
  },
  { 
    value: "qna", 
    label: "Q&A", 
    icon: "❓", 
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-violet-100 to-purple-200/50"
  },
  { 
    value: "diy", 
    label: "DIY Projects", 
    icon: "🛠", 
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-yellow-200/50"
  }
];

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
    const files = e.target.files;
    if (!files) return;

    // Check total number of images (existing + new)
    if (selectedImages.length + files.length > 6) {
      toast({
        title: "Too many images",
        description: "Maximum 6 images allowed",
        variant: "destructive"
      });
      return;
    }

    // Check file sizes and types
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    Array.from(files).forEach(file => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image`,
          variant: "destructive"
        });
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setSelectedImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...validPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] 
      from-green-50 via-emerald-50/80 to-teal-50/60 pb-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff40_1px,transparent_1px),linear-gradient(to_bottom,#ffffff40_1px,transparent_1px)] 
        bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="container relative mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full 
            bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium">
            Create New Post
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 
            to-teal-600 bg-clip-text text-transparent">
            Share Your Plant Story
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a beautiful post to share your plant journey with our growing community
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Form Card */}
          <div className="md:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl 
              hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent 
                via-green-500/20 to-transparent" />
              
              <CardHeader className="space-y-2 border-b border-gray-100/50 pb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 
                    bg-clip-text text-transparent">
                    Create Your Post
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                  Share your knowledge and inspire others
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title Input */}
                  <div className="group space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Title
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 
                        to-emerald-100 text-green-700 text-xs">
                        {title.length}/100
                      </Badge>
                    </label>
                    <div className="relative">
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your post a catchy title"
                        className="border-gray-200 focus:ring-green-500 focus:border-green-500
                          transition-all duration-300 h-12 pr-4 rounded-xl"
                        maxLength={100}
                        required
                      />
                      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-green-500 
                        to-emerald-500 opacity-0 blur-xl group-hover:opacity-20 transition-opacity 
                        duration-500" />
                    </div>
                  </div>

                  {/* Description Area */}
                  <div className="group space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Description
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 
                        to-emerald-100 text-green-700 text-xs">
                        {description.length}/500
                      </Badge>
                    </label>
                    <div className="relative">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share your plant story, tips, or questions..."
                        className="min-h-[200px] border-gray-200 focus:ring-green-500 
                          focus:border-green-500 transition-all duration-300 rounded-xl"
                        maxLength={500}
                        required
                      />
                      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-green-500 
                        to-emerald-500 opacity-0 blur-xl group-hover:opacity-20 transition-opacity 
                        duration-500" />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Images
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 
                        to-emerald-100 text-green-700 text-xs">
                        {imagePreviews.length}/6
                      </Badge>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <AnimatePresence mode="popLayout">
                        {imagePreviews.map((preview, index) => (
                          <motion.div
                            key={preview}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
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
                      </AnimatePresence>

                      {imagePreviews.length < 6 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="aspect-square rounded-xl border-2 border-dashed 
                            border-gray-300 hover:border-green-500 transition-all duration-300 
                            cursor-pointer bg-gradient-to-br from-gray-50 to-white
                            hover:from-green-50 hover:to-emerald-50
                            flex flex-col items-center justify-center gap-3 group"
                          onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                          <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200
                            group-hover:from-green-100 group-hover:to-emerald-100 transition-colors 
                            duration-300">
                            <Camera className="w-6 h-6 text-gray-400 group-hover:text-green-600 
                              transition-colors duration-300" />
                          </div>
                          <span className="text-sm text-gray-500 group-hover:text-green-600 
                            transition-colors duration-300">
                            Add Photos
                          </span>
                          <span className="text-xs text-gray-400 group-hover:text-green-500 
                            transition-colors duration-300">
                            {6 - imagePreviews.length} remaining
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
                      onClick={(e) => {
                        // Reset the value to allow selecting the same file again
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum 6 images, each up to 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>

                  {/* Category Selection */}
                  <div className="group space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <div className="relative">
                      <Select value={tag} onValueChange={(value) => setTag(value)}>
                        <SelectTrigger className="border-gray-200 focus:ring-green-500 
                          focus:border-green-500 h-12 rounded-xl">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {tagOptions.map(({ value, label, icon, color, bgColor }) => (
                            <SelectItem 
                              key={value} 
                              value={value}
                              className="focus:bg-gray-50"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full ${bgColor} 
                                  flex items-center justify-center`}>
                                  <span className="text-lg">{icon}</span>
                                </div>
                                <span className={`bg-gradient-to-r ${color} 
                                  bg-clip-text text-transparent font-medium`}>
                                  {label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-green-500 
                        to-emerald-500 opacity-0 blur-xl group-hover:opacity-20 transition-opacity 
                        duration-500" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 
                      hover:from-green-700 hover:to-emerald-700 text-white shadow-lg 
                      hover:shadow-xl transition-all duration-300 rounded-xl relative group"
                  >
                    <div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_0deg,theme(colors.green.600),theme(colors.emerald.600),theme(colors.green.600))] 
                      opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Creating your post...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Share with Community</span>
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl 
              hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r 
                from-transparent via-green-500/20 to-transparent" />
              
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

              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Create a post and share it with the community.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-green-200 hover:bg-green-50 group transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 group-hover:text-green-600" />
                    Ask Community
                  </Button>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                <div className="space-y-3">
                  {tagOptions.map(({ value, label, icon, color, bgColor }) => (
                    <motion.div
                      key={value}
                      whileHover={{ x: 4 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl 
                        bg-gradient-to-r from-gray-50 to-transparent
                        hover:from-green-50 hover:to-transparent
                        transition-colors duration-300">
                        <div className={`w-10 h-10 rounded-full ${bgColor} 
                          flex items-center justify-center shadow-sm
                          group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-xl">{icon}</span>
                        </div>
                        <span className={`font-medium bg-gradient-to-r ${color} 
                          bg-clip-text text-transparent`}>
                          {label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full group border-green-200 hover:bg-green-50 
                rounded-xl h-11 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 
                transition-transform duration-300" />
              <span className="bg-gradient-to-r from-gray-600 to-gray-900 
                group-hover:from-green-600 group-hover:to-emerald-600
                bg-clip-text text-transparent transition-all duration-300">
                Back to Posts
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;
