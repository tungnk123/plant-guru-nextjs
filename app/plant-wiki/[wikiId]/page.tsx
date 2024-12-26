'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WikiCard } from '@/app/api/wikiService';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Users, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Navbar from '@/app/components/navbar/Navbar';

export default function WikiArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<WikiCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWiki = async () => {
      try {
        // Fetch wiki by ID
        // const wikiData = await fetchWikiById(params.wikiId as string);
        // setWiki(wikiData);
        // Temporary mock data
        setWiki({
          id: params.wikiId as string,
          title: "Plant Care Guide",
          thumbnailImageUrl: "",
          upvotes: 10,
          contributorCount: 5,
        });
      } catch (error) {
        console.error('Error fetching wiki:', error);
        toast.error('Failed to load wiki article');
      } finally {
        setLoading(false);
      }
    };

    loadWiki();
  }, [params.wikiId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggle={() => {}} />
      <div className="pt-24 flex justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );

  if (!wiki) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar toggle={() => {}} />
      
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wiki
          </Button>

          <Card className="overflow-hidden border border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {wiki.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {wiki.upvotes} upvotes
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {wiki.contributorCount} contributors
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last updated {format(new Date(), 'PP')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="mt-4">
              {wiki.thumbnailImageUrl && (
                <div className="mb-6">
                  <img
                    src={wiki.thumbnailImageUrl}
                    alt={wiki.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  Content will be displayed here...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 