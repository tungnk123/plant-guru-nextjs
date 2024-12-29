'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createWikiArticle } from '@/app/api/wikiService';
import Navbar from '@/app/components/navbar/Navbar';
import { ArrowLeft, BookPlus, Image as ImageIcon, FileText, Link2, AlertCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CreateWikiPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createWikiArticle({
        title,
        description: content,
        thumbnailImageUrl: thumbnailImageUrl || '',
        authorId: localStorage.getItem('userId') || '',
        productIds: []
      });

      toast.success('Wiki created successfully!', {
        duration: 3000, // Show for 3 seconds
      });

      setTimeout(() => {
        router.push('/plant-wiki');
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error('Error creating wiki:', error);
      toast.error('Failed to create wiki');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="group flex items-center gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Wiki List
            </Button>
          </div>

          <Card className="border-gray-200/50 shadow-lg">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookPlus className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Wiki</h1>
              </div>
              <p className="text-sm text-gray-500">
                Create a new wiki article with rich content and media.
              </p>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Title
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter wiki title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-gray-200 focus:ring-blue-500"
                  />
                </div>

                {/* Thumbnail URL Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    Thumbnail Image URL
                  </Label>
                  <Input
                    placeholder="Enter image URL..."
                    value={thumbnailImageUrl}
                    onChange={(e) => setThumbnailImageUrl(e.target.value)}
                    className="border-gray-200 focus:ring-blue-500"
                  />
                  {thumbnailImageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <div className="relative aspect-video">
                        <img
                          src={thumbnailImageUrl}
                          alt="Thumbnail preview"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Content
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Enter wiki content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] border-gray-200 focus:ring-blue-500"
                  />
                </div>

                {/* Required Fields Note */}
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>Fields marked with * are required</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="h-5 w-5" />
                      Creating Wiki...
                    </>
                  ) : (
                    <>
                      <BookPlus className="h-5 w-5" />
                      Create Wiki
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 