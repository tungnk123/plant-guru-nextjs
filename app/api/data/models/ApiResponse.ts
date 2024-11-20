export interface Classification {
  suggestions: Suggestion[];
}

export interface Description {
  value: string;
  citation: string;
  license_name: string;
  license_url: string;
}

export interface Details {
  common_names: string[];
  taxonomy: Taxonomy;
  url: string;
  gbif_id: number;
  inaturalist_id: number;
  rank: string;
  description: Description;
  synonyms: string[];
  image: Image;
  edible_parts: string[];
  language: string;
  entity_id: string;
}

export interface Image {
  value: string;
  citation: string;
  license_name: string;
  license_url: string;
}

export interface Input {
  images: string[];
  datetime: Date;
  latitude: number;
  longitude: number;
  similar_images: boolean;
}

export interface IsPlant {
  binary: boolean;
  threshold: number;
  probability: number;
}

export interface Result {
  is_plant: IsPlant;
  classification: Classification;
}

export interface Root {
  access_token: string;
  model_version: string;
  custom_id: any;
  input: Input;
  result: Result;
  status: string;
  sla_compliant_client: boolean;
  sla_compliant_system: boolean;
  created: number;
  completed: number;
}

export interface SimilarImage {
  id: string;
  url: string;
  license_name: string;
  license_url: string;
  citation: string;
  similarity: number;
  url_small: string;
}

export interface Suggestion {
  id: string;
  name: string;
  probability: number;
  similar_images: SimilarImage[];
  details: Details;
}

export interface Taxonomy {
  class: string;
  genus: string;
  order: string;
  family: string;
  phylum: string;
  kingdom: string;
}
