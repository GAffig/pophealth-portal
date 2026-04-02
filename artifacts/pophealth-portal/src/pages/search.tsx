import { useState } from "react";
import { useSearchIndicators, useSaveSource, getListSavedSourcesQueryKey, SearchRequestState } from "@workspace/api-client-react";
import { Search, Loader2, Star, Save, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { CountySelector, countyIdsToNames } from "@/components/county-selector";
import { buildDeepLink, COUNTY_FIPS_MAP } from "@/lib/deeplinks";
import type { Indicator } from "@workspace/api-client-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  
  const searchMutation = useSearchIndicators();
  const saveMutation = useSaveSource();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const countyNames = countyIdsToNames(selectedCounties);

    const allTn = selectedCounties.length > 0 && selectedCounties.every(id => id.startsWith("TN:"));
    const allVa = selectedCounties.length > 0 && selectedCounties.every(id => id.startsWith("VA:"));

    const effectiveState: SearchRequestState | undefined =
      allTn ? SearchRequestState.TN
      : allVa ? SearchRequestState.VA
      : stateFilter === "TN" ? SearchRequestState.TN
      : stateFilter === "VA" ? SearchRequestState.VA
      : undefined;

    searchMutation.mutate({
      data: {
        query,
        state: effectiveState,
        counties: countyNames.length > 0 ? countyNames : undefined,
      }
    });
  };

  const handleSave = (indicator: Indicator) => {
    saveMutation.mutate({
      data: { indicatorId: indicator.id }
    }, {
      onSuccess: () => {
        toast({ title: "Source saved to Evidence Tray", description: `${indicator.name} in ${indicator.county}` });
        queryClient.invalidateQueries({ queryKey: getListSavedSourcesQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to save source", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search Indicators</h1>
          <p className="text-muted-foreground">Query health indicators by keyword across all counties and domains. Use region presets to quickly scope to NE Tennessee or SW Virginia.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-card p-6 rounded-xl border shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="e.g. adult obesity, mental health providers, childhood poverty"
                className="pl-10 h-12 text-base font-mono bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" disabled={searchMutation.isPending} data-testid="btn-submit-search">
              {searchMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
          </div>

          <div className="border-t pt-4">
            <CountySelector
              selectedCounties={selectedCounties}
              onChangeCounties={setSelectedCounties}
              selectedState={stateFilter}
              onChangeState={setStateFilter}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-sm text-muted-foreground py-1">Try:</span>
            {["diabetes prevalence", "mental health providers", "childhood poverty", "tobacco use"].map(prompt => (
              <Badge 
                key={prompt} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
                onClick={() => setQuery(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </form>

        {searchMutation.data && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-muted p-4 rounded-lg border text-sm flex justify-between items-center">
              <div>
                <span className="font-semibold">Interpretation:</span> {searchMutation.data.interpretation}
              </div>
              <Badge variant="outline" className="font-mono">{searchMutation.data.totalCount} results</Badge>
            </div>
            
            {searchMutation.data.results.length === 0 ? (
              <div className="text-center p-12 border rounded-xl bg-card">
                <p className="text-muted-foreground text-lg">No results found for this query.</p>
              </div>
            ) : (
              <div className="border rounded-xl bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Indicator</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchMutation.data.results.map((indicator) => (
                      <TableRow key={indicator.id} className="group" data-testid={`row-indicator-${indicator.id}`}>
                        <TableCell>
                          <div className="font-medium">{indicator.name}</div>
                          <div className="text-xs text-muted-foreground">{indicator.domainName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{indicator.state}</div>
                          <div className="text-xs text-muted-foreground">{indicator.county}</div>
                          {COUNTY_FIPS_MAP[`${indicator.state}:${indicator.county}`] && (
                            <div className="text-xs font-mono text-muted-foreground/70">
                              FIPS {COUNTY_FIPS_MAP[`${indicator.state}:${indicator.county}`]}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-mono font-bold text-lg">{indicator.value}</div>
                          <div className="text-xs text-muted-foreground">{indicator.year}</div>
                        </TableCell>
                        <TableCell>
                          <a href={buildDeepLink(indicator)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline" data-testid={`link-source-${indicator.id}`}>
                            {indicator.source} <ExternalLink className="h-3 w-3" />
                          </a>
                          <div className="flex items-center mt-1" title={`Authority Rank: ${indicator.authorityRank}/5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < indicator.authorityRank ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleSave(indicator)}
                            disabled={saveMutation.isPending}
                            data-testid={`btn-save-${indicator.id}`}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
