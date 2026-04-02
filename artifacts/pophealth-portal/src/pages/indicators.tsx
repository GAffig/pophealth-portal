import { useState, useMemo } from "react";
import { useListIndicators, useListDomains } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CountySelector } from "@/components/county-selector";

export default function IndicatorsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialDomain = searchParams.get('domain') || "all";
  
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>(initialDomain);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);

  const { data: domains } = useListDomains();
  
  const { data: allIndicators, isLoading } = useListIndicators({
    state: stateFilter !== "all" ? stateFilter as any : undefined,
    domain: domainFilter !== "all" ? domainFilter : undefined,
  }, { query: { queryKey: ['indicators', stateFilter, domainFilter] }});

  const indicators = useMemo(() => {
    if (!allIndicators) return [];
    if (selectedCounties.length === 0) return allIndicators;
    return allIndicators.filter(ind =>
      selectedCounties.some(countyId => {
        const [state, name] = countyId.split(":");
        return ind.state === state && ind.county === name;
      })
    );
  }, [allIndicators, selectedCounties]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Indicator Directory</h1>
          <p className="text-muted-foreground">Complete directory of all health indicators tracked across counties. Filter by domain, state, or select specific counties using the region presets.</p>
        </div>

        <div className="bg-card p-5 rounded-xl border shadow-sm space-y-4">
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

          <div className="border-t pt-4">
            <CountySelector
              selectedCounties={selectedCounties}
              onChangeCounties={setSelectedCounties}
              selectedState={stateFilter}
              onChangeState={setStateFilter}
            />
          </div>
        </div>

        <div className="border rounded-xl bg-card overflow-hidden">
          {!isLoading && indicators !== undefined && (
            <div className="px-4 py-2 border-b bg-muted/30 text-xs font-mono text-muted-foreground">
              {indicators.length} indicator{indicators.length !== 1 ? "s" : ""}
              {selectedCounties.length > 0
                ? ` in ${selectedCounties.map(id => id.split(":")[1]).join(", ")}`
                : " across all counties"}
            </div>
          )}
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
              ) : indicators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No indicators match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                indicators.map(indicator => (
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
