'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wiki, fetchWikiById } from '@/app/api/wikiService';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Users, Calendar, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrentDate } from '@/app/lib/utils';
import Navbar from '@/app/components/navbar/Navbar';
import { Textarea } from '@/components/ui/textarea';
import { submitContribution } from '@/app/api/contributionService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function WikiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [loading, setLoading] = useState(true);
  const [contribution, setContribution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadWiki = async () => {
      try {
        const wikiData = await fetchWikiById(params.wikiId as string);
        setWiki(wikiData);
        setContribution(wikiData.content || '');
      } catch (error) {
        console.error('Error fetching wiki:', error);
        toast.error('Failed to load wiki article');
      } finally {
        setLoading(false);
      }
    };

    loadWiki();
  }, [params.wikiId]);

  const handleContribute = async () => {
    if (!contribution.trim()) {
      toast.error('Please enter your contribution');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if user is logged in
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to contribute');
        return;
      }

      const result = await submitContribution(params.wikiId as string, contribution);
      console.log('Contribution submitted:', result);
      toast.success('Contribution submitted successfully');
      setContribution('');
    } catch (error) {
      console.error('Error submitting contribution:', error);
      if (error instanceof Error && error.message === 'User not logged in') {
        toast.error('Please login to contribute');
      } else {
        toast.error('Failed to submit contribution');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      {wiki.contributorIds.length} contributors
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatCurrentDate()}
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
                <p className="text-gray-600 whitespace-pre-line">
                  {wiki.content}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 border border-gray-200">
            <CardHeader>
              <CardTitle>Contribute to this Wiki</CardTitle>
              <p className="text-sm text-gray-500">
                Edit the content below to submit your contribution
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your knowledge..."
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button 
                  className="w-full"
                  onClick={handleContribute}
                  disabled={isSubmitting || !contribution.trim() || contribution === wiki?.content}
                >
                  {isSubmitting ? (
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 