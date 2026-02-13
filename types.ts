
export enum Era {
  ANCIENT_EGYPT = 'Antiguo Egipto',
  RENAISSANCE = 'Renacimiento',
  ROARING_20S = 'Años 20',
  SAMURAI_JAPAN = 'Japón Feudal',
  VIKING_AGE = 'Era Vikinga',
  CYBERPUNK_FUTURE = 'Futuro Cyberpunk',
  PIRATE_GOLDEN_AGE = 'Edad de Oro de la Piratería'
}

export interface AnalysisResult {
  features: string;
  clothingStyle: string;
  vibe: string;
}

export interface GeneratedImage {
  url: string;
  era: Era;
  prompt: string;
  timestamp: number;
}
