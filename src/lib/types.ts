export interface Config {
  id: string;
  title: string;
  config: string;
  updated_at?: string;
}

export interface ConfigsData {
  configs: Config[];
}

// Response types
export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  message: string;
} 