export type PresetLevel = "low" | "medium" | "high" | "extreme" | "custom";

export type ProjectPreset =
  | "none"
  | "node-backend"
  | "react-frontend"
  | "bot-telegram-whatsapp";

export type StringEncoding = "none" | "base64" | "rc4" | "hex";

export interface WatermarkSettings {
  enabled: boolean;
  useCustomName: boolean;
  customName: string;
}

export interface ExpirySettings {
  enabled: boolean;
  expiryDate: string; // ISO date, e.g. 2026-08-30
  expiredMessage: string;
}

export interface LockSettings {
  domainLockEnabled: boolean;
  domains: string; // comma separated
  disableConsoleOutput: boolean;
  selfDefending: boolean;
  debugProtection: boolean;
}

export interface ObfuscationSettings {
  level: PresetLevel;
  projectPreset: ProjectPreset;
  stringArrayEncoding: StringEncoding;
  controlFlowFlattening: boolean;
  controlFlowFlatteningThreshold: number;
  deadCodeInjection: boolean;
  deadCodeInjectionThreshold: number;
  renameIdentifiers: boolean;
  compact: boolean;
  locks: LockSettings;
  watermark: WatermarkSettings;
  expiry: ExpirySettings;
}

export interface SecurityAlert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  suggestedSettings: string[];
}

export interface ObfuscationResult {
  code: string;
  originalSizeBytes: number;
  outputSizeBytes: number;
  elapsedMs: number;
}
