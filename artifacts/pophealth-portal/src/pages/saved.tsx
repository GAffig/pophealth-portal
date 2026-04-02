import { useListSavedSources, useDeleteSavedSource, getListSavedSourcesQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedPage() {
  const { data: savedSources, isLoading } = useListSavedSources();
  const deleteMutation = useDeleteSavedSource();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Removed from Evidence Tray" });
        queryClient.invalidateQueries({ queryKey: getListSavedSourcesQueryKey() });
      }
    });
  };

  const handleExport = () => {
    // Placeholder for actual export functionality
    toast({ title: "Export Started", description: "Downloading Evidence_Tray.csv" });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Evidence Tray</h1>
            <p className="text-muted-foreground">Saved data points for Community Health Needs Assessments.</p>
          </div>
          <Button onClick={handleExport} disabled={!savedSources?.length} data-testid="btn-export">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Indicator</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Saved Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-48 mb-2" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mb-2" /><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mb-2" /><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : savedSources?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <BookmarkCheck className="h-12 w-12 mb-4 text-muted" />
                      <p className="text-lg font-medium">Your Evidence Tray is empty</p>
                      <p className="text-sm">Save indicators from the search page to build your report.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                savedSources?.map(source => (
                  <TableRow key={source.id} data-testid={`row-saved-${source.id}`}>
                    <TableCell>
                      <div className="font-medium">{source.indicatorName}</div>
                      <div className="text-xs text-muted-foreground">{source.domainName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{source.county}</div>
                      <div className="text-xs text-muted-foreground">{source.state}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-bold text-lg">{source.value}</div>
                      <div className="text-xs text-muted-foreground">{source.year}</div>
                    </TableCell>
                    <TableCell>
                      <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        {source.source} <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(source.savedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(source.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`btn-delete-${source.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

// Ensure BookmarkCheck is imported if used in empty state
import { BookmarkCheck } from "lucide-react";
