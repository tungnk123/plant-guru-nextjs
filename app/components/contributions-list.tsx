'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { Contribution } from "@/app/api/contributionService";
import { formatCurrentDate } from "@/app/lib/utils";
import { useState } from "react";
import RejectDialog from "@/app/components/reject-dialog";
import { getContributionDiff, ContributionDiff } from "@/app/api/contributionService";
import ContributionDiffView from "./contribution-diff";
import { toast } from "react-hot-toast";

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
  const [selectedDiff, setSelectedDiff] = useState<ContributionDiff | null>(null);
  const [loadingDiff, setLoadingDiff] = useState(false);

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

  const handleViewDiff = async (wikiId: string, contributionId: string) => {
    console.log('Fetching diff for:', { wikiId, contributionId });
    setLoadingDiff(true);
    setSelectedContributionId(contributionId);
    try {
      const diff = await getContributionDiff(wikiId, contributionId);
      console.log('Diff response:', diff);
      console.log('Diff lines:', diff.diffLines);
      setSelectedDiff(diff);
    } catch (error) {
      console.error('Error loading diff:', error);
      toast.error('Failed to load changes');
      setSelectedContributionId(null);
      setSelectedDiff(null);
    } finally {
      setLoadingDiff(false);
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
                  onClick={() => {
                    console.log('View Changes clicked for:', contribution.id);
                    if (selectedContributionId === contribution.id) {
                      setSelectedContributionId(null);
                      setSelectedDiff(null);
                    } else {
                      handleViewDiff(contribution.wikiId, contribution.id);
                    }
                  }}
                  disabled={loadingDiff}
                  className="border-blue-500 text-blue-500 hover:bg-blue-100"
                >
                  {loadingDiff ? (
                    'Loading...'
                  ) : selectedContributionId === contribution.id ? (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Hide Changes
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      View Changes
                    </>
                  )}
                </Button>
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
            {selectedDiff && selectedContributionId === contribution.id && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-2 border-b">
                  <h4 className="text-sm font-medium">Changes</h4>
                </div>
                <div className="p-2">
                  <ContributionDiffView diffLines={selectedDiff.diffLines} />
                </div>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-line">
                {contribution.content}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setSelectedContributionId(null);
        }}
        onConfirm={handleRejectConfirm}
        contributionId={selectedContributionId || ""}
      />
    </div>
  );
} 