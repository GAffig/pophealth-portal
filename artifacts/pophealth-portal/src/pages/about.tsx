import { Layout } from "@/components/layout";
import { Activity, Database, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About the JMH Portal</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The Johnston Memorial Hospital Population Health Data Portal is a professional-grade 
            tool designed for public health analysts, hospital planners, and Community Health Needs Assessment (CHNA) teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            icon={Database} 
            title="Comprehensive Coverage" 
            description="Access data across 20 distinct health domains and 86+ standardized indicators for comprehensive health assessment."
          />
          <FeatureCard 
            icon={Activity} 
            title="Regional Focus" 
            description="Specifically tailored for Tennessee and Virginia counties served by Johnston Memorial Hospital."
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Authoritative Sources" 
            description="All indicators are ranked by authority and link directly to primary sources like CDC, state health departments, and census data."
          />
          <FeatureCard 
            icon={Users} 
            title="Built for Planners" 
            description="Features an Evidence Tray to save, organize, and export indicators directly for CHNA reporting."
          />
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Mission Statement</h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>
          <p className="text-lg leading-relaxed text-card-foreground">
            To empower healthcare decision-makers with precise, authoritative, and easily retrievable 
            population health data, ensuring that community health interventions are guided by the highest quality evidence.
          </p>
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
