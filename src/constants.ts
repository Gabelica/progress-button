import type { ButtonProgressCardConfig } from "./types";

export const CARD_VERSION = "__CARD_VERSION__";
export const CARD_TAG_NAME = "button-progress-card";
export const EDITOR_TAG_NAME = "button-progress-card-editor";

export const TIMER_DOMAIN = "timer";
export const NUMERIC_DOMAINS = ["input_number", "number", "counter", "sensor"] as const;

export const DEFAULT_CONFIG: Partial<ButtonProgressCardConfig> = {
  name: "",
  icon: "",
  bar_color: "var(--accent-color)",
  bar_height: 4,
  reverse: true,
  bar_min: 0,
  bar_max: 100,
  tap_action: { action: "toggle" },
  hold_action: { action: "more-info" },
  double_tap_action: { action: "none" },
};

export const HOLD_THRESHOLD_MS = 500;
export const DOUBLE_TAP_THRESHOLD_MS = 300;

export const DOMAIN_ICON_MAP: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  input_boolean: "mdi:checkbox-marked-circle",
  fan: "mdi:fan",
  media_player: "mdi:cast",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter",
  lock: "mdi:lock",
  vacuum: "mdi:robot-vacuum",
  automation: "mdi:robot",
  script: "mdi:script-text",
};

export const ON_STATES = ["on", "active", "playing", "open", "unlocked", "home"] as const;