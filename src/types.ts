export interface ActionConfig {
  action: "toggle" | "more-info" | "call-service" | "perform-action" | "navigate" | "url" | "none";
  perform_action?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  navigation_path?: string;
  url_path?: string;
}

export interface ButtonProgressCardConfig {
  entity: string;
  timer_entity?: string;
  name?: string;
  icon?: string;
  bar_color?: string;
  bar_height?: number;
  reverse?: boolean;
  bar_min?: number;
  bar_max?: number;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;
  language: string;
}

export interface TimerAttributes {
  duration: string;
  finishes_at: string;
  remaining: string;
  editable: boolean;
  friendly_name: string;
}

export interface NumericAttributes {
  min?: number;
  max?: number;
  step?: number;
  unit_of_measurement?: string;
  friendly_name?: string;
}

declare global {
  interface Window {
    customCards: Array<Record<string, unknown>>;
  }
}