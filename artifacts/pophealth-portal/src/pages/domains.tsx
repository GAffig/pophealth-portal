import { useListDomains } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { DomainCard } from "@/components/domain-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DomainsPage() {
  const { data: domains, isLoading } = useListDomains();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Health Domains</h1>
          <p className="text-muted-foreground">Browse all 20 public health domains available in the Population Health Data Portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))
            : domains?.map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
        </div>
      </div>
    </Layout>
  );
}
