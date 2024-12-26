"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar/Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createWikiArticle } from '@/app/api/wikiService';
import { toast } from "react-hot-toast";

export default function CreateWikiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailImageUrl: '',
    productIds: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      await createWikiArticle({
        ...formData,
        authorId: userId
      });

      toast.success('Wiki article created successfully!');
      router.push('/plant-wiki');
    } catch (error) {
      toast.error('Failed to create wiki article');
      console.error('Error creating wiki:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggle={() => {}} />
      
      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Wiki Article</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter article title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter article description"
                className="w-full min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thumbnail Image URL</label>
              <Input
                required
                value={formData.thumbnailImageUrl}
                onChange={(e) => setFormData({...formData, thumbnailImageUrl: e.target.value})}
                placeholder="Enter image URL"
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Creating...' : 'Create Article'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 