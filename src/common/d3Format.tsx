import { FormatLocaleDefinition, formatLocale, formatSpecifier } from "d3-format";

/*
  See - https://stackoverflow.com/questions/17037023/how-to-get-localizable-or-customizable-si-codes-with-d3-format
*/


const baseLocale = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""],
};

// You can define your own si prefix abbr. here
const d3SiPrefixMap: Record<string,string> = {
    y: "e-24",
    z: "e-21",
    a: "e-18",
    f: "e-15",
    p: "e-12",
    n: "e-9",
    µ: "e-6",
    m: "e-3",
    "": "",
    k: "K",
    M: "M",
    G: "B",
    T: "T",
    P: "P",
    E: "E",
    Z: "Z",
    Y: "Y",
};

const d3Format = (specifier: string) => {
  const locale = formatLocale({ ...baseLocale } as FormatLocaleDefinition);
  const formattedSpecifier = formatSpecifier(specifier);
  const valueFormatter = locale.format(specifier);
  
  return (value: number) => {
      const result = valueFormatter(value);
      if (formattedSpecifier.type === "s") { 
        // modify the return value when using si-prefix. 
        const lastChar = result[result.length - 1];
        if (Object.keys(d3SiPrefixMap).includes(lastChar)) {
          return result.slice(0, -1) + d3SiPrefixMap[lastChar];
        }
      }
      // return the default result from d3 format in case the format type is not set to `s` (si suffix)
      return result;
  };
}

export default d3Format;