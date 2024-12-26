'use client';

import { Contribution } from "@/app/api/contributionService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";

interface ContributionsListProps {
  contributions: Contribution[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ContributionsList({ 
  contributions,
  onApprove,
  onReject
}: ContributionsListProps) {
  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <Card key={contribution.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Contributed on {format(new Date(contribution.createdAt), 'PPP')}
              </p>
              <p className="whitespace-pre-wrap">{contribution.content}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => onApprove(contribution.id)}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onReject(contribution.id)}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 