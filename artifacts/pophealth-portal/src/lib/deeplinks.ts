/**
 * County FIPS lookup and deep-link URL generator for federal health data sources.
 * FIPS codes: 5-digit (state 2 + county 3)
 */

export const COUNTY_FIPS_MAP: Record<string, string> = {
  "TN:Carter":       "47019",
  "TN:Cocke":        "47029",
  "TN:Greene":       "47059",
  "TN:Hamblen":      "47063",
  "TN:Hancock":      "47067",
  "TN:Hawkins":      "47073",
  "TN:Johnson":      "47091",
  "TN:Knox":         "47093",
  "TN:Sevier":       "47155",
  "TN:Sullivan":     "47163",
  "TN:Unicoi":       "47171",
  "TN:Washington":   "47179",
  "VA:Bland":        "51021",
  "VA:Bristol City": "51520",
  "VA:Buchanan":     "51027",
  "VA:Carroll":      "51035",
  "VA:Dickenson":    "51051",
  "VA:Galax City":   "51640",
  "VA:Grayson":      "51077",
  "VA:Lee":          "51105",
  "VA:Russell":      "51167",
  "VA:Scott":        "51169",
  "VA:Smyth":        "51173",
  "VA:Tazewell":     "51185",
  "VA:Washington":   "51191",
  "VA:Wise":         "51195",
};

const STATE_NAMES: Record<string, string> = {
  TN: "tennessee",
  VA: "virginia",
};

function fips(state: string, county: string): string | undefined {
  return COUNTY_FIPS_MAP[`${state}:${county}`];
}

function countySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Return a county-specific deep link for the given indicator.
 * Falls back to the stored sourceUrl if no specialised pattern applies.
 */
export function buildDeepLink(indicator: {
  source: string;
  sourceUrl: string;
  state: string;
  county: string;
}): string {
  const { source, sourceUrl, state, county } = indicator;
  const f = fips(state, county);

  if (source.includes("American Community Survey")) {
    if (f && sourceUrl.includes("data.census.gov/table/")) {
      const separator = sourceUrl.includes("?") ? "&" : "?";
      return `${sourceUrl}${separator}g=050XX00US${f}`;
    }
    if (f) {
      return `https://data.census.gov/profile/050XX00US${f}`;
    }
    return sourceUrl;
  }

  if (source.includes("County Health Rankings")) {
    const stateName = STATE_NAMES[state] ?? state.toLowerCase();
    const slug = countySlug(county.replace(/ City$/, "").replace(/ County$/, ""));
    const year = 2024;
    const base = `https://www.countyhealthrankings.org/health-data/${stateName}/${slug}/${year}`;
    return f ? `${base}?county=${f}` : base;
  }

  if (source.includes("CDC PLACES") || source.includes("PLACES")) {
    if (f) {
      return `https://chronicdata.cdc.gov/500-Cities-Places/PLACES-Local-Data-for-Better-Health-County-Data-20/swc5-untg/about_data?County_FIPS=${f}`;
    }
    return "https://chronicdata.cdc.gov/500-Cities-Places/PLACES-Local-Data-for-Better-Health-County-Data-20/swc5-untg/about_data";
  }

  if (source.includes("USDA") || source.includes("Economic Research Service")) {
    return "https://www.ers.usda.gov/data-products/atlas-of-rural-and-small-town-america/go-to-the-atlas/";
  }

  if (source.includes("SAHIE") || source.includes("Small Area Health Insurance")) {
    if (f) {
      return `https://data.census.gov/table/ACSST5Y2023.S2701?g=050XX00US${f}`;
    }
    return "https://www.census.gov/data/datasets/time-series/demo/sahie/estimates-acs.html";
  }

  if (source.includes("BRFSS") || source.includes("Behavioral Risk Factor")) {
    return "https://www.cdc.gov/brfss/brfssprevalence/index.html";
  }

  if (source.includes("CDC WONDER") || source.includes("WONDER")) {
    return "https://wonder.cdc.gov/mcd-icd10-provisional.html";
  }

  return sourceUrl;
}
