import { useGetPortalSummary, useListDomains } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Activity, Database, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainCard } from "@/components/domain-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout";

export default function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetPortalSummary();
  const { data: domains, isLoading: isLoadingDomains } = useListDomains();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-12">
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Population Health Data Portal
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground font-light">
              Secondary Data Retrieval for Population Health Analysis
            </h2>
          </div>
          <p className="text-lg max-w-3xl text-foreground/80 leading-relaxed">
            Find, filter, and save authoritative county-level health indicators for Northeast Tennessee and Southwest Virginia. Built for analysts preparing population health projects, grant applications, and community assessments using trusted secondary data.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/search">
              <Button size="lg" className="font-medium px-8" data-testid="btn-start-search">
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Button>
            </Link>
            <Link href="/indicators">
              <Button size="lg" variant="outline" className="font-medium px-8" data-testid="btn-browse-indicators">
                Browse Indicators
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Domains"
            value={isLoadingSummary ? null : summary?.totalDomains}
            icon={Database}
            testId="stat-domains"
          />
          <StatCard
            title="Indicators"
            value={isLoadingSummary ? null : summary?.totalIndicators}
            icon={Activity}
            testId="stat-indicators"
          />
          <StatCard
            title="Counties"
            value={isLoadingSummary ? null : summary?.totalCounties}
            icon={MapPin}
            testId="stat-counties"
          />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight">Health Domains</h3>
            <Link href="/domains">
              <Button variant="ghost" className="font-medium" data-testid="link-all-domains">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingDomains
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
                ))
              : domains?.slice(0, 8).map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon: Icon, testId }: { title: string, value: number | null | undefined, icon: any, testId: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4" data-testid={testId}>
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="text-3xl font-bold font-mono">
          {value !== null && value !== undefined ? value : <Skeleton className="h-8 w-16 mt-1" />}
        </div>
      </div>
    </div>
  );
}
