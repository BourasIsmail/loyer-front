export interface RASConfig {
  id: number;
  lowerThreshold1: number;
  upperThreshold1: number;
  percentage1: number;
  lowerThreshold2: number;
  upperThreshold2: number;
  percentage2: number;
  percentage3: number;
  specialCasePercentages: Record<number, number>;
}

// Optional: If you want to create a type for creating a new RASConfig without an id
export type CreateRASConfig = Omit<RASConfig, "id">;

// Optional: If you want to create a type for updating an existing RASConfig
export type UpdateRASConfig = Partial<RASConfig>;
