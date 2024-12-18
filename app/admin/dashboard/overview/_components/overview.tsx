'use client';
import { useEffect, useState } from "react";
import { fetchUnapprovedPosts, approvePost } from "@/app/admin/api/post";
import { fetchUsers, removePremium } from "@/app/admin/api/user";
import { AreaGraph } from "./area-graph";
import { BarGraph } from "./bar-graph";
import { PieGraph } from "./pie-graph";
import { CalendarDateRangePicker } from "@/components-admin/date-range-picker";
import PageContainer from "@/components-admin/layout/page-container";
import { RecentSales } from "./recent-sales";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Check, FileText, User } from "lucide-react";

export default function OverViewPage() {
  const [postStats, setPostStats] = useState({ totalPosts: 0, posts: [] });
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [postsResponse, usersResponse] = await Promise.all([
          fetchUnapprovedPosts(),
          fetchUsers(),
        ]);

        setPostStats(postsResponse);
        setUserStats(usersResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const handleApprovePost = async (postId) => {
    try {
      await approvePost(postId);
  
      setPostStats((prevStats) => {
        const updatedPosts = prevStats.posts.filter((post) => post.id !== postId);
        return {
          ...prevStats,
          posts: updatedPosts,
          totalPosts: prevStats.totalPosts - 1,
        };
      });
  
      toast({
        title: "Post Approved ✅",
        description: "The post has been successfully approved.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error approving post:", error);
  
      toast({
        title: "Approval Failed ❌",
        description: "There was an error approving the post. Try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  

  const handleRemovePremium = async (userId) => {
    try {
      await removePremium(userId);
      alert("Premium removed from user successfully!");
    } catch (error) {
      console.error("Error removing premium:", error);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-3 md:flex">
            <CalendarDateRangePicker />
            <Button variant="outline">Download Report</Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center">
              <Card className="text-center">
                <CardHeader className="flex flex-col items-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-sm font-medium mt-2">
                    Total Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-6 w-24 mx-auto" />
                  ) : (
                    <div className="text-2xl font-bold text-blue-600">
                      {postStats.totalPosts}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="flex flex-col items-center">
                  <User className="h-6 w-6 text-green-500" />
                  <CardTitle className="text-sm font-medium mt-2">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-6 w-24 mx-auto" />
                  ) : (
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.length}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="flex flex-col items-center">
                  <Check className="h-6 w-6 text-purple-500" />
                  <CardTitle className="text-sm font-medium mt-2">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-6 w-24 mx-auto" />
                  ) : (
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.filter((user) => user.isHavePremium).length}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="flex flex-col items-center">
                  <BarChart3 className="h-6 w-6 text-red-500" />
                  <CardTitle className="text-sm font-medium mt-2">
                    Unapproved Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-6 w-24 mx-auto" />
                  ) : (
                    <div className="text-2xl font-bold text-red-600">
                      {postStats.posts.length}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Graphs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>
                    Latest unapproved posts requiring attention.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <ul className="space-y-4">
                      {postStats.posts.slice(0, 5).map((post) => (
                        <li
                          key={post.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <span className="text-sm">{post.title}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovePost(post.id)}
                          >
                            Approve
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Graphs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <Card className="col-span-3">
                <PieGraph />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
