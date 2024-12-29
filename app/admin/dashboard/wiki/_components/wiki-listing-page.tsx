'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { WikiCard, fetchWikiCards } from '@/app/api/wikiService';
import { Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';
import WikiTable from './wiki-tables';
import { cn } from '@/lib/utils';

export default function WikiListingPage() {
  const [wikiCards, setWikiCards] = useState<WikiCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWikiCards = async () => {
      try {
        const data = await fetchWikiCards();
        setWikiCards(data);
      } catch (error) {
        console.error('Error fetching wiki cards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWikiCards();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Heading
              title={`Wiki Articles (${wikiCards.length})`}
              description="Manage plant wiki articles and content."
              icon={BookOpen}
            />
            <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Active Articles</span>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>Pending Review</span>
              </div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Link
              href="/plant-wiki"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <BookOpen className="mr-2 h-4 w-4" /> View Wiki
            </Link>
            <Link
              href="/admin/dashboard/wiki/create"
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Article
            </Link>
          </div>
        </div>
        
        <Separator />
        
        <div className="rounded-md border bg-card">
          <div className="p-4">
            <WikiTable 
              data={wikiCards} 
              totalData={wikiCards.length} 
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
