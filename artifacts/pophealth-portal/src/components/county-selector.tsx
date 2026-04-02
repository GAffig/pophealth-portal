import { useState } from "react";
import { useListCounties } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, X, ChevronDown, ChevronUp } from "lucide-react";

const NE_TN_COUNTIES = [
  "Carter", "Cocke", "Greene", "Hamblen", "Hancock",
  "Hawkins", "Johnson", "Sullivan", "Unicoi", "Washington"
];

const SW_VA_COUNTIES = [
  "Bland", "Bristol City", "Buchanan", "Carroll", "Dickenson",
  "Galax City", "Grayson", "Lee", "Russell", "Scott",
  "Smyth", "Tazewell", "Washington", "Wise"
];

interface CountySelectorProps {
  selectedCounties: string[];
  onChangeCounties: (counties: string[]) => void;
  selectedState: string;
  onChangeState: (state: string) => void;
}

export function CountySelector({
  selectedCounties,
  onChangeCounties,
  selectedState,
  onChangeState,
}: CountySelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const { data: allCounties = [] } = useListCounties();

  const tnCounties = allCounties.filter(c => c.state === "TN").sort((a, b) => a.name.localeCompare(b.name));
  const vaCounties = allCounties.filter(c => c.state === "VA").sort((a, b) => a.name.localeCompare(b.name));

  const visibleTn = selectedState === "VA" ? [] : tnCounties;
  const visibleVa = selectedState === "TN" ? [] : vaCounties;

  function toggleCounty(name: string) {
    if (selectedCounties.includes(name)) {
      onChangeCounties(selectedCounties.filter(c => c !== name));
    } else {
      onChangeCounties([...selectedCounties, name]);
    }
  }

  function applyPreset(countyNames: string[], state: "TN" | "VA") {
    const allSelected = countyNames.every(n => selectedCounties.includes(n));
    if (allSelected) {
      onChangeCounties(selectedCounties.filter(n => !countyNames.includes(n)));
      if (selectedState === state) onChangeState("all");
    } else {
      const merged = Array.from(new Set([...selectedCounties, ...countyNames]));
      const newStateHasTn = merged.some(n => tnCounties.some(c => c.name === n));
      const newStateHasVa = merged.some(n => vaCounties.some(c => c.name === n));
      onChangeCounties(merged);
      if (newStateHasTn && !newStateHasVa) onChangeState("TN");
      else if (newStateHasVa && !newStateHasTn) onChangeState("VA");
      else onChangeState("all");
    }
  }

  const neTnActive = NE_TN_COUNTIES.every(n => selectedCounties.includes(n));
  const swVaActive = SW_VA_COUNTIES.every(n => selectedCounties.includes(n));

  const showCountyGrid = expanded || selectedCounties.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          Region presets:
        </span>
        <Button
          type="button"
          variant={neTnActive ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs font-medium"
          onClick={() => applyPreset(NE_TN_COUNTIES, "TN")}
          data-testid="preset-ne-tn"
        >
          NE Tennessee
        </Button>
        <Button
          type="button"
          variant={swVaActive ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs font-medium"
          onClick={() => applyPreset(SW_VA_COUNTIES, "VA")}
          data-testid="preset-sw-va"
        >
          SW Virginia
        </Button>
        {selectedCounties.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => { onChangeCounties([]); onChangeState("all"); }}
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">State:</span>
        {["all", "TN", "VA"].map(s => (
          <Button
            key={s}
            type="button"
            variant={selectedState === s ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onChangeState(s)}
          >
            {s === "all" ? "All" : s === "TN" ? "Tennessee" : "Virginia"}
          </Button>
        ))}
      </div>

      {selectedCounties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCounties.map(name => (
            <Badge
              key={name}
              variant="default"
              className="gap-1 pl-2 pr-1 py-0.5 text-xs font-normal cursor-default"
            >
              {name}
              <button
                type="button"
                onClick={() => toggleCounty(name)}
                className="hover:opacity-70 rounded-full"
                aria-label={`Remove ${name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Hide" : "Show"} individual county picker
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 p-3 border rounded-lg bg-muted/30">
            {visibleTn.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tennessee</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleTn.map(c => {
                    const active = selectedCounties.includes(c.name);
                    return (
                      <button
                        key={c.fips}
                        type="button"
                        onClick={() => toggleCounty(c.name)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/60 hover:bg-primary/5"
                        }`}
                        data-testid={`county-chip-${c.fips}`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {visibleVa.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Virginia</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleVa.map(c => {
                    const active = selectedCounties.includes(c.name);
                    return (
                      <button
                        key={c.fips}
                        type="button"
                        onClick={() => toggleCounty(c.name)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/60 hover:bg-primary/5"
                        }`}
                        data-testid={`county-chip-${c.fips}`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
