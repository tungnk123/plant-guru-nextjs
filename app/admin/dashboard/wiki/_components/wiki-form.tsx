'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createWikiArticle, WikiCard } from '@/app/api/wikiService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  }),
  thumbnailImageUrl: z.string().url({
    message: 'Please enter a valid image URL.'
  }).optional(),
});

type WikiFormProps = {
  initialData?: WikiCard;
  isEditing?: boolean;
};

export default function WikiForm({ initialData, isEditing = false }: WikiFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(initialData?.thumbnailImageUrl || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: '',
      thumbnailImageUrl: initialData?.thumbnailImageUrl || '',
    }
  });

  const handleImageUrlChange = (url: string) => {
    form.setValue('thumbnailImageUrl', url);
    setPreviewImage(url);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      if (isEditing) {
        // Add your update logic here
        toast.success('Wiki article updated successfully');
      } else {
        await createWikiArticle({
          title: values.title,
          description: values.description,
          thumbnailImageUrl: values.thumbnailImageUrl || '',
          authorId: userId,
          productIds: []
        });
        toast.success('Wiki article created successfully');
      }
      
      router.push('/admin/dashboard/wiki');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error submitting wiki:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEditing ? 'Edit Wiki Article' : 'Create New Wiki Article'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter article title" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and descriptive title for your wiki article.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed article description"
                      className="min-h-[200px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide comprehensive information about the plant, including care instructions and requirements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="thumbnailImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image URL</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="Enter image URL"
                            {...field}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            disabled={isLoading}
                          />
                          <FormDescription className="mt-2">
                            Paste a URL to an image that represents your article.
                          </FormDescription>
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                          {previewImage ? (
                            <img 
                              src={previewImage} 
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={() => setPreviewImage('')}
                            />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon className="h-12 w-12 mb-2" />
                              <span>Image preview</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Create Article'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
