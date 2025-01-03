'use client';
import React, { useEffect, useState } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembershipListingPage from './_components/membership-listing-page';
import MembershipHistoryPage from './_components/membership-history-page';
import MembershipService, { Membership, MembershipHistory } from '@/app/admin/api/membership';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = ({ searchParams }: PageProps) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [membershipHistory, setMembershipHistory] = useState<MembershipHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedSearchParams = await searchParams;
        searchParamsCache.parse(resolvedSearchParams);

        const [membershipsData, historyData] = await Promise.all([
          MembershipService.getMemberships(),
          MembershipService.getMembershipHistory()
        ]);

        setMemberships(membershipsData);
        setMembershipHistory(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleMembershipUpdate = async (updatedMembership: Membership) => {
    setMemberships((prevMemberships) =>
      prevMemberships.map((membership) =>
        membership.id === updatedMembership.id ? updatedMembership : membership
      )
    );
  };

  const handleDeleteMembership = async (id: string) => {
    try {
      await MembershipService.deleteMembership(id);
      setMemberships((prevMemberships) =>
        prevMemberships.filter((membership) => membership.id !== id)
      );
    } catch (error) {
      console.error('Error deleting membership:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-green-100 animate-spin border-t-green-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <NuqsAdapter>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 
            to-teal-600 bg-clip-text text-transparent">
            Membership Management
          </h1>
          <p className="text-gray-600">Manage and track all membership activities</p>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-6">
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] p-1 bg-gray-100/80 
              rounded-xl gap-1">
              <TabsTrigger 
                value="current"
                className="rounded-lg data-[state=active]:bg-gradient-to-r 
                  data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 
                  data-[state=active]:text-white transition-all duration-300
                  hover:bg-gray-200/50"
              >
                Current Memberships
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="rounded-lg data-[state=active]:bg-gradient-to-r 
                  data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 
                  data-[state=active]:text-white transition-all duration-300
                  hover:bg-gray-200/50"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="current">
                <MembershipListingPage
                  data={memberships}
                  totalData={memberships.length}
                  onMembershipUpdate={handleMembershipUpdate}
                  onDeleteMembership={handleDeleteMembership}
                />
              </TabsContent>

              <TabsContent value="history">
                <MembershipHistoryPage data={membershipHistory} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </NuqsAdapter>
  );
};

export default Page;
