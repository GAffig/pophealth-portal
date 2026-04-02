import { useState } from "react";
import { useListIndicators, useListDomains } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IndicatorsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialDomain = searchParams.get('domain') || "all";
  
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>(initialDomain);
  const [countyFilter, setCountyFilter] = useState<string>("");

  const { data: domains } = useListDomains();
  
  const { data: indicators, isLoading } = useListIndicators({
    state: stateFilter !== "all" ? stateFilter as any : undefined,
    domain: domainFilter !== "all" ? domainFilter : undefined,
    county: countyFilter || undefined
  }, { query: { queryKey: ['indicators', stateFilter, domainFilter, countyFilter] }});

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Indicator Directory</h1>
          <p className="text-muted-foreground">Complete directory of all health indicators tracked across counties.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <div className="w-full md:w-48">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger data-testid="select-filter-state">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="TN">Tennessee</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger data-testid="select-filter-domain">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains?.map(d => (
                  <SelectItem key={d.id} value={d.slug}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by county name..." 
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="pl-9"
              data-testid="input-filter-county"
            />
          </div>
        </div>

        <div className="border rounded-xl bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Indicator & Domain</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-48 mb-2" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mb-2" /><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mb-2" /><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : indicators?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No indicators match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                indicators?.map(indicator => (
                  <TableRow key={indicator.id} data-testid={`row-indicator-${indicator.id}`}>
                    <TableCell>
                      <div className="font-medium text-foreground">{indicator.name}</div>
                      <Badge variant="outline" className="mt-1 text-xs font-normal">
                        {indicator.domainName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{indicator.county}</div>
                      <div className="text-xs text-muted-foreground">{indicator.state} • {indicator.region}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-bold text-lg">{indicator.value}</div>
                      <div className="text-xs text-muted-foreground">{indicator.year}</div>
                    </TableCell>
                    <TableCell>
                      <a href={indicator.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        {indicator.source} <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
