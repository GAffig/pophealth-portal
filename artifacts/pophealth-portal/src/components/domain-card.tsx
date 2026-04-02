import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import type { Domain } from "@workspace/api-client-react";

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  return (
    <Link href={`/indicators?domain=${domain.slug}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group hover-elevate">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
              {domain.name}
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
          <CardDescription className="line-clamp-3 h-[60px] text-sm mt-2">
            {domain.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="font-mono text-xs">
            {domain.indicatorCount} Indicators
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
