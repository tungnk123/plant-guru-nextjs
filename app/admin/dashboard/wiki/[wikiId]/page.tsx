'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wiki, fetchWikiById } from '@/app/api/wikiService';
import { Contribution, fetchPendingContributions, fetchContributionHistory, approveContribution, rejectContribution } from '@/app/api/contributionService';
import PageContainer from '@/components-admin/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, Clock, User2, History, BookOpen, 
  ThumbsUp, MessageSquare, Eye, Edit3, Shield, ArrowLeft 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrentDate } from '@/app/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContributionsList from '@/app/components/contributions-list';
import { fetchUserById, User } from "@/app/admin/api/user";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Navbar from '@/app/components/navbar/Navbar';

export default function AdminWikiPage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [history, setHistory] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributorUsers, setContributorUsers] = useState<Record<string, User>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    const loadUserInfo = async (contributorId: string) => {
      if (contributorUsers[contributorId] || loadingUsers[contributorId]) return;

      setLoadingUsers(prev => ({ ...prev, [contributorId]: true }));
      try {
        console.log('Fetching user info for history:', contributorId);
        const user = await fetchUserById(contributorId);
        console.log('Fetched user for history:', user);
        setContributorUsers(prev => ({ ...prev, [contributorId]: user }));
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoadingUsers(prev => ({ ...prev, [contributorId]: false }));
      }
    };

    history.forEach(contribution => {
      if (contribution.contributorId) {
        loadUserInfo(contribution.contributorId);
      }
    });
  }, [history]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full" />
            
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{wiki?.title}</h1>
            </div>

            {wiki?.thumbnailImageUrl && (
              <div className="mb-6">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <img
                    src={wiki.thumbnailImageUrl}
                    alt={wiki.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Featured image for {wiki.title}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg p-3 cursor-help">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm font-medium">Created: {formatCurrentDate()}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  Creation date of the wiki article
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 bg-purple-50 text-purple-700 rounded-lg p-3 cursor-help">
                    <User2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{wiki?.contributorIds?.length || 0} Contributors</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  Number of unique contributors
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg p-3 cursor-help">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Active Article</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  This article is currently active
                </HoverCardContent>
              </HoverCard>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{wiki?.content}</p>
              </div>
            </ScrollArea>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pending Contributions</h2>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Awaiting Review
              </Badge>
            </div>
            <ContributionsList
              contributions={contributions}
              onApprove={handleApproveContribution}
              onReject={handleRejectContribution}
            />
          </div>

          <Separator className="my-8" />

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <History className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Contribution History</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                Moderated Content
              </div>
            </div>

            <div className="space-y-4">
              {history.map((contribution) => (
                <Card key={contribution.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {contributorUsers[contribution.contributorId] ? (
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {contributorUsers[contribution.contributorId].avatar ? (
                                <img
                                  src={contributorUsers[contribution.contributorId].avatar}
                                  alt="Avatar"
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                                  {(contributorUsers[contribution.contributorId].name || 
                                    contributorUsers[contribution.contributorId].email)[0].toUpperCase()}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                <Edit3 className="h-3 w-3 text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {contributorUsers[contribution.contributorId].name || 
                                 contributorUsers[contribution.contributorId].email}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <CalendarDays className="h-3 w-3" />
                                {formatCurrentDate()}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={contribution.status === 1 ? "success" : "destructive"}
                        className={`px-3 py-1 ${
                          contribution.status === 1 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {contribution.status === 1 ? (
                            <ThumbsUp className="h-3 w-3" />
                          ) : (
                            <MessageSquare className="h-3 w-3" />
                          )}
                          {contribution.status === 1 ? 'Approved' : 'Rejected'}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {contribution.content}
                      </p>
                    </div>
                    {contribution.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 mb-2">
                          <MessageSquare className="h-4 w-4" />
                          <p className="font-medium">Rejection Reason</p>
                        </div>
                        <p className="text-sm text-red-600">
                          {contribution.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
