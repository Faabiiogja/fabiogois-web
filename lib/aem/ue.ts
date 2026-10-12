import type { FragmentMeta } from "./types";

// Helpers para os atributos de instrumentação do Universal Editor.
// Content Fragments são endereçados por `<path>/jcr:content/data/<variação>`.

type AueType = "text" | "richtext" | "media" | "container" | "reference";

export function aueFragment(fragment: FragmentMeta, label: string) {
  return {
    "data-aue-resource": `urn:aemconnection:${fragment._path}/jcr:content/data/${fragment._variation}`,
    "data-aue-type": "reference" as AueType,
    "data-aue-filter": "cf",
    "data-aue-label": label,
  };
}

export function aueProp(prop: string, type: AueType, label?: string) {
  return {
    "data-aue-prop": prop,
    "data-aue-type": type,
    ...(label ? { "data-aue-label": label } : {}),
  };
}

export function aueContainer(prop: string, filter: string, label: string) {
  return {
    "data-aue-prop": prop,
    "data-aue-type": "container" as AueType,
    "data-aue-filter": filter,
    "data-aue-label": label,
  };
}
