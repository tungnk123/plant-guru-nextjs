'use client';
import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MembershipHistory } from '@/app/admin/api/membership';
import { motion } from "framer-motion";
import { Search, DollarSign, Users, TrendingUp } from "lucide-react";

interface MembershipHistoryPageProps {
  data: MembershipHistory[];
}

export default function MembershipHistoryPage({ data }: MembershipHistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = filteredHistory.reduce((sum, item) => sum + item.packagePrice, 0);
    const uniqueUsers = new Set(filteredHistory.map(item => item.userId)).size;
    const avgPrice = total / filteredHistory.length || 0;

    return { total, uniqueUsers, avgPrice };
  }, [filteredHistory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-none shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-green-700">
                ${stats.total.toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-none shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200">
              <Users className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unique Members</p>
              <h3 className="text-2xl font-bold text-emerald-700">
                {stats.uniqueUsers}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-none shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-200">
              <TrendingUp className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Price</p>
              <h3 className="text-2xl font-bold text-teal-700">
                ${stats.avgPrice.toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 
            to-emerald-600 bg-clip-text text-transparent">
            Membership History
          </h2>
          <p className="text-gray-500 mt-1">
            {filteredHistory.length} total transactions
          </p>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
            text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-gray-200 focus:ring-green-500 
              focus:border-green-500 transition-all"
          />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Purchase Date</TableHead>
              <TableHead className="font-semibold">Expiry Date</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item, index) => (
              <TableRow 
                key={item.userId}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 
                      to-emerald-200 flex items-center justify-center text-green-700 font-semibold">
                      {item.name.charAt(0)}
                    </div>
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-sm font-medium 
                    bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                    {item.packageName}
                  </span>
                </TableCell>
                <TableCell>{new Date(item.boughtAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.boughtAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">
                    ${item.packagePrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-sm font-medium
                    bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                    Active
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
            <TableRow>
              <TableCell colSpan={4} className="font-semibold">
                Total Revenue
              </TableCell>
              <TableCell className="font-bold text-green-700">
                ${stats.total.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </motion.div>
  );
} 