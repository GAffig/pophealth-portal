import { useState } from "react";
import { useListCounties } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

const NE_TN_NAMES = [
  "Carter", "Cocke", "Greene", "Hamblen", "Hancock",
  "Hawkins", "Johnson", "Sullivan", "Unicoi", "Washington"
];

const SW_VA_NAMES = [
  "Bland", "Bristol City", "Buchanan", "Carroll", "Dickenson",
  "Galax City", "Grayson", "Lee", "Russell", "Scott",
  "Smyth", "Tazewell", "Washington", "Wise"
];

const NE_TN_IDS = NE_TN_NAMES.map(n => `TN:${n}`);
const SW_VA_IDS = SW_VA_NAMES.map(n => `VA:${n}`);

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
  const [showPicker, setShowPicker] = useState(true);
  const { data: allCounties = [] } = useListCounties();

  const tnCounties = allCounties.filter(c => c.state === "TN").sort((a, b) => a.name.localeCompare(b.name));
  const vaCounties = allCounties.filter(c => c.state === "VA").sort((a, b) => a.name.localeCompare(b.name));

  const visibleTn = selectedState === "VA" ? [] : tnCounties;
  const visibleVa = selectedState === "TN" ? [] : vaCounties;

  function countyId(state: string, name: string) {
    return `${state}:${name}`;
  }

  function toggleCounty(state: string, name: string) {
    const id = countyId(state, name);
    if (selectedCounties.includes(id)) {
      onChangeCounties(selectedCounties.filter(c => c !== id));
    } else {
      onChangeCounties([...selectedCounties, id]);
    }
  }

  function applyPreset(ids: string[], presetState: "TN" | "VA") {
    const allSelected = ids.every(id => selectedCounties.includes(id));
    if (allSelected) {
      const next = selectedCounties.filter(id => !ids.includes(id));
      onChangeCounties(next);
      if (selectedState === presetState && next.every(id => id.startsWith(`${presetState}:`))) {
        // still same state or now empty — keep or reset
        if (next.length === 0) onChangeState("all");
      }
    } else {
      const merged = Array.from(new Set([...selectedCounties, ...ids]));
      onChangeCounties(merged);
      const hasTn = merged.some(id => id.startsWith("TN:"));
      const hasVa = merged.some(id => id.startsWith("VA:"));
      if (hasTn && !hasVa) onChangeState("TN");
      else if (hasVa && !hasTn) onChangeState("VA");
      else onChangeState("all");
    }
  }

  const neTnActive = NE_TN_IDS.every(id => selectedCounties.includes(id));
  const swVaActive = SW_VA_IDS.every(id => selectedCounties.includes(id));

  function displayName(id: string) {
    return id.split(":")[1];
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Region presets:
        </span>
        <Button
          type="button"
          variant={neTnActive ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs font-medium"
          onClick={() => applyPreset(NE_TN_IDS, "TN")}
          data-testid="preset-ne-tn"
        >
          NE Tennessee
        </Button>
        <Button
          type="button"
          variant={swVaActive ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs font-medium"
          onClick={() => applyPreset(SW_VA_IDS, "VA")}
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
            data-testid="btn-clear-counties"
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
          {selectedCounties.map(id => (
            <Badge
              key={id}
              variant="default"
              className="gap-1 pl-2 pr-1 py-0.5 text-xs font-normal cursor-default"
            >
              {displayName(id)}
              <span className="text-[10px] opacity-70">{id.startsWith("TN:") ? "TN" : "VA"}</span>
              <button
                type="button"
                onClick={() => {
                  const [st, nm] = id.split(":");
                  toggleCounty(st, nm);
                }}
                className="hover:opacity-70 rounded-full"
                aria-label={`Remove ${displayName(id)}`}
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
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pb-2"
          onClick={() => setShowPicker(!showPicker)}
          data-testid="toggle-county-picker"
        >
          {showPicker ? "▲" : "▼"} {showPicker ? "Hide" : "Show"} individual county picker
        </button>

        {showPicker && (
          <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
            {visibleTn.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tennessee</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleTn.map(c => {
                    const id = countyId(c.state, c.name);
                    const active = selectedCounties.includes(id);
                    return (
                      <button
                        key={c.fips}
                        type="button"
                        onClick={() => toggleCounty(c.state, c.name)}
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
                    const id = countyId(c.state, c.name);
                    const active = selectedCounties.includes(id);
                    return (
                      <button
                        key={c.fips}
                        type="button"
                        onClick={() => toggleCounty(c.state, c.name)}
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

export function countyIdsToNames(ids: string[]): string[] {
  return ids.map(id => id.split(":")[1]);
}

export function countyIdToState(id: string): string {
  return id.split(":")[0];
}
