'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Contribution } from "@/app/api/contributionService";
import { formatCurrentDate } from "@/app/lib/utils";
import { useState } from "react";
import RejectDialog from "@/app/components/reject-dialog";

interface ContributionsListProps {
  contributions: Contribution[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function ContributionsList({
  contributions,
  onApprove,
  onReject
}: ContributionsListProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedContributionId, setSelectedContributionId] = useState<string | null>(null);

  const handleRejectClick = (contributionId: string) => {
    setSelectedContributionId(contributionId);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (selectedContributionId) {
      await onReject(selectedContributionId, reason);
      setSelectedContributionId(null);
    }
  };  

  if (contributions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="text-gray-500">No pending contributions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {contributions.map((contribution) => (
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-500 hover:bg-green-100"
                    onClick={() => onApprove(contribution.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-100"
                    onClick={() => handleRejectClick(contribution.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">
                  {contribution.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setSelectedContributionId(null);
        }}
        onConfirm={handleRejectConfirm}
        contributionId={selectedContributionId || ""}
      />
    </>
  );
} 