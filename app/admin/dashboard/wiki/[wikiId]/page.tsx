'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WikiCard } from '@/app/api/wikiService';
import { Contribution, fetchPendingContributions } from '@/app/api/contributionService';
import PageContainer from '@/components-admin/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ThumbsUp, Users, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContributionsList from '@/app/components/contributions-list';

export default function AdminWikiPage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<WikiCard | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch contributions only
        const contributionsData = await fetchPendingContributions(params.wikiId as string);
        
        // Temporary mock wiki data
        setWiki({
          id: params.wikiId as string,
          title: "Plant Care Guide",
          thumbnailImageUrl: "",
          upvotes: 10,
          contributorCount: 5,
        });
        
        setContributions(contributionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.wikiId]);

  const handleEdit = () => {
    router.push(`/admin/dashboard/wiki/${params.wikiId}/edit`);
  };

  const handleDelete = async () => {
    // Add delete confirmation and API call
    toast.success('Wiki article deleted');
    router.push('/admin/dashboard/wiki');
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </PageContainer>
    );
  }

  if (!wiki) return null;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wiki List
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-100"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-100"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <ScrollArea>
          <Card className="border border-gray-200">
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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Pending Contributions</h2>
            <ContributionsList 
              contributions={contributions}
              onApprove={(id) => {
                setContributions(prev => prev.filter(c => c.id !== id));
                toast.success('Contribution approved');
              }}
              onReject={(id) => {
                setContributions(prev => prev.filter(c => c.id !== id));
                toast.success('Contribution rejected');
              }}
            />
          </div>
        </ScrollArea>
      </div>
    </PageContainer>
  );
}
