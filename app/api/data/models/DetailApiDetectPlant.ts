export interface Classification {
    suggestions: Suggestion[];
  }
  
  export interface Description {
    value: string;
    citation: string;
    licenseName: string;
    licenseUrl: string;
  }
  
  export interface Details {
    commonNames: string[];
    taxonomy: Taxonomy;
    url: string;
    gbifId: number;
    inaturalistId: number;
    rank: string;
    description: Description;
    synonyms: string[];
    image: Image;
    edibleParts: string[];
    language: string;
    entityId: string;
  }
  
  export interface Image {
    value: string;
    citation: string;
    licenseName: string;
    licenseUrl: string;
  }
  
  export interface Input {
    images: string[];
    datetime: Date;
    latitude: number;
    longitude: number;
    similarImages: boolean;
  }
  
  export interface IsPlant {
    binary: boolean;
    threshold: number;
    probability: number;
  }
  
  export interface Result {
    isPlant: IsPlant;
    classification: Classification;
  }
  
  export interface Root {
    accessToken: string;
    modelVersion: string;
    customId: any;
    input: Input;
    result: Result;
    status: string;
    slaCompliantClient: boolean;
    slaCompliantSystem: boolean;
    created: number;
    completed: number;
  }
  
  export interface SimilarImage {
    id: string;
    url: string;
    licenseName: string;
    licenseUrl: string;
    citation: string;
    similarity: number;
    urlSmall: string;
  }
  
  export interface Suggestion {
    id: string;
    name: string;
    probability: number;
    similarImages: SimilarImage[];
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
  