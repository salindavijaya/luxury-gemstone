// src/types/gemstone.ts
export type GemstoneType =
  | "diamond"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "pearl"
  | "opal";

export type Cut = "excellent" | "very good" | "good" | "fair" | "poor";

export type Color = "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M";

export type Clarity =
  | "FL"
  | "IF"
  | "VVS1"
  | "VVS2"
  | "VS1"
  | "VS2"
  | "SI1"
  | "SI2"
  | "I1"
  | "I2"
  | "I3";

export type Shape =
  | "round"
  | "princess"
  | "cushion"
  | "oval"
  | "emerald"
  | "pear"
  | "marquise"
  | "radiant"
  | "heart";

export type CertificationAgency = "GIA" | "AGS" | "SSEF" | "Gübelin" | "IGI";

export interface Dimensions {
  length: number;
  width: number;
  depth: number;
  unit: "mm" | "cm";
}

export interface GemstoneSpecifications {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  shape: Shape;
  origin?: string;
  dimensions?: Dimensions;
  fluorescence?: string;
  treatments?: string[];
  polish?: string;
  symmetry?: string;
}

export interface Certification {
  agency: CertificationAgency;
  certificateNumber: string;
  date: string;
  reportUrl?: string;
  verified: boolean;
}

export type StockStatus =
  | "in_stock"
  | "out_of_stock"
  | "low_stock"
  | "back_order"
  | "pre_order";
