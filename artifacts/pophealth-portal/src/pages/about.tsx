import { Layout } from "@/components/layout";
import { Activity, Database, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About This Portal</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The Population Health Data Portal is a secondary-data research tool built for analysts, 
            planners, and researchers who need quick access to authoritative county-level health 
            indicators for Northeast Tennessee and Southwest Virginia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            icon={Database} 
            title="Comprehensive Coverage" 
            description="Access data across 20 distinct health domains and 86+ standardized indicators from CDC, U.S. Census, USDA, and other authoritative sources."
          />
          <FeatureCard 
            icon={Activity} 
            title="Regional Focus" 
            description="Specifically curated for the NE Tennessee and SW Virginia region — covering 24 counties across both states for targeted geographic analysis."
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Authoritative Sources" 
            description="All indicators are ranked by authority and link directly to primary sources: CDC PLACES, American Community Survey, County Health Rankings, CDC WONDER, and USDA ERS."
          />
          <FeatureCard 
            icon={Users} 
            title="Built for Analysts" 
            description="Features an Evidence Tray to save, organize, and export indicators for population health projects, grant applications, and community assessments."
          />
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Purpose</h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>
          <p className="text-lg leading-relaxed text-card-foreground">
            This portal exists to make secondary data retrieval faster and more reliable for population 
            health analysts. Rather than navigating multiple federal and state data systems, analysts 
            can search across all indicators in one place, evaluate source authority, and build an 
            evidence base tailored to their defined geography.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Data Sources</h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>
          <ul className="space-y-2 text-card-foreground">
            <li className="flex items-start gap-3">
              <span className="font-mono text-primary font-bold mt-0.5">CDC</span>
              <span>PLACES — Local-area health estimates (chronic conditions, behaviors, preventive services)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-primary font-bold mt-0.5">ACS</span>
              <span>American Community Survey — Socioeconomic, housing, and demographic indicators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-primary font-bold mt-0.5">CHR</span>
              <span>County Health Rankings — Health outcomes and health factors by county</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-primary font-bold mt-0.5">WONDER</span>
              <span>CDC WONDER — Mortality and cause-of-death data by county</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-primary font-bold mt-0.5">USDA</span>
              <span>Economic Research Service — Rural classification, food access, and poverty indicators</span>
            </li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground font-mono pt-8 border-t">
          System Version: 1.0.0-beta • Data last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="bg-card/50 border-border/50 shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
