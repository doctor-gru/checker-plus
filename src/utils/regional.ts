import RegionalJson from "../assets/regional";

export const countryCodeToName = (code: string): string => {
  // let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  // return regionNames.of(code) ?? "Not Specified";
  return (
    RegionalJson.find((region) => region["alpha-2"] == code)?.name ??
    "Not Specified"
  );
};
