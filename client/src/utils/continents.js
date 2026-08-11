import countries from "world-countries";

const CODE_TO_CONTINENT = {};

countries.forEach((country) => {
  const code = country.cca2;

  let continent = country.region;

  // world-countries uses "Americas", so split it
  // into the two categories used by CrediMap.
  if (continent === "Americas") {
    if (country.subregion === "South America") {
      continent = "South America";
    } else {
      continent = "North America";
    }
  }

  if (code && continent) {
    CODE_TO_CONTINENT[code] = continent;
  }
});

export function getContinent(countryCode) {
  if (!countryCode) return null;

  return CODE_TO_CONTINENT[countryCode.toUpperCase()] || null;
}

export const CONTINENT_OPTIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];