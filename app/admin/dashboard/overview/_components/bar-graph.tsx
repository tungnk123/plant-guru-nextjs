'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function BarGraph({ postStats, userStats }) {
  const [activeChart, setActiveChart] = React.useState<'posts' | 'users'>('posts');

  // Prepare dynamic chart data using postStats and userStats
  const chartData = React.useMemo(() => {
    const data = [];

    for (let i = 0; i < Math.max(postStats.posts.length, userStats.length); i++) {
      data.push({
        date: `Day ${i + 1}`,
        posts: postStats.posts[i]?.postUpvotes || 0,
        users: userStats[i]?.isHavePremium ? 1 : 0
      });
    }
    return data;
  }, [postStats, userStats]);

  // Calculate totals for posts and users
  const total = React.useMemo(() => ({
    posts: postStats.posts.reduce((acc, curr) => acc + (curr.postUpvotes || 0), 0),
    users: userStats.filter((user) => user.isHavePremium).length
  }), [postStats, userStats]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6">
        <div>
          <CardTitle className="text-lg sm:text-2xl">Interactive Bar Chart</CardTitle>
          <CardDescription>Showing data from posts and users</CardDescription>
        </div>
        <div className="flex">
          {['posts', 'users'].map((key) => {
            const chart = key as 'posts' | 'users';
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`relative flex flex-col items-center px-4 py-2 sm:px-6 sm:py-3 border-l first:border-l-0 cursor-pointer ${
                  activeChart === chart ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-sm text-gray-500">
                  {chart === 'posts' ? 'Total Upvotes' : 'Premium Users'}
                </span>
                <span className="text-lg font-bold">{total[chart].toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartContainer config={{}}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey={activeChart === 'posts' ? 'Posts Upvotes' : 'Premium Users'}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={activeChart === 'posts' ? '#3b82f6' : '#f59e0b'} // Blue for posts, yellow for users
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
 