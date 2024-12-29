'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wiki, fetchWikiById } from '@/app/api/wikiService';
import { Contribution, fetchPendingContributions, fetchContributionHistory, approveContribution, rejectContribution } from '@/app/api/contributionService';
import PageContainer from '@/components-admin/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ThumbsUp, Users, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrentDate } from '@/app/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContributionsList from '@/app/components/contributions-list';

export default function AdminWikiPage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [history, setHistory] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wikiData, contributionsData, historyData] = await Promise.all([
          fetchWikiById(params.wikiId as string),
          fetchPendingContributions(params.wikiId as string),
          fetchContributionHistory(params.wikiId as string)
        ]);
        
        console.log('Wiki Data:', wikiData);
        console.log('History Data:', historyData);
        
        setWiki(wikiData);
        setContributions(contributionsData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.wikiId]);

  const handleApproveContribution = async (contributionId: string) => {
    try {
      const result = await approveContribution(params.wikiId as string, contributionId);
      console.log('Approve result:', result);
      
      // Update contributions list by removing the approved one
      setContributions(prev => prev.filter(c => c.id !== contributionId));
      
      // Update wiki content with the new content
      setWiki(prev => prev ? {
        ...prev,
        content: result.content,
        contributorIds: [...prev.contributorIds, contributionId] // Add contributor
      } : null);

      // Refresh history to show the approved contribution
      const newHistory = await fetchContributionHistory(params.wikiId as string);
      setHistory(newHistory);
      
      toast.success('Contribution approved successfully');
    } catch (error) {
      console.error('Error approving contribution:', error);
      toast.error('Failed to approve contribution');
    }
  };

  const handleRejectContribution = async (contributionId: string, reason: string) => {
    try {
      await rejectContribution(params.wikiId as string, contributionId, reason);
      
      // Update contributions list by removing the rejected one
      setContributions(prev => prev.filter(c => c.id !== contributionId));
      
      // Refresh history
      const newHistory = await fetchContributionHistory(params.wikiId as string);
      setHistory(newHistory);
      
      toast.success('Contribution rejected successfully');
    } catch (error) {
      console.error('Error rejecting contribution:', error);
      toast.error('Failed to reject contribution');
    }
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
              onClick={() => router.push(`/admin/dashboard/wiki/${wiki.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-100"
              onClick={() => {/* handle delete */}}
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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Pending Contributions</h2>
            <ContributionsList 
              contributions={contributions}
              onApprove={handleApproveContribution}
              onReject={handleRejectContribution}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Contribution History</h2>
            <div className="space-y-4">
              {history.map((contribution) => (
                <Card key={contribution.id}>
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            Contributor ID: {contribution.contributorId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrentDate()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={contribution.status === 1 ? "success" : "destructive"}>
                        {contribution.status === 1 ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-2">
                    <div className="prose max-w-none">
                      <p className="text-gray-600 whitespace-pre-line">
                        {contribution.content}
                      </p>
                    </div>
                    {contribution.rejectionReason && (
                      <div className="mt-2 text-sm text-red-600">
                        Rejection reason: {contribution.rejectionReason}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </PageContainer>
  );
}
