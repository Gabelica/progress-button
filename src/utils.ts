import type { HomeAssistant, ActionConfig, ButtonProgressCardConfig, HassEntity } from "./types";
import { TIMER_DOMAIN, NUMERIC_DOMAINS, DOMAIN_ICON_MAP, ON_STATES } from "./constants";

/**
 * Returns true if the entity ID belongs to the timer domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is a timer
 */
export function isTimerEntity(entityId: string): boolean {
  return entityId.split(".")[0] === TIMER_DOMAIN;
}

/**
 * Returns true if the entity ID belongs to a supported numeric domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is numeric
 */
export function isNumericEntity(entityId: string): boolean {
  const domain = entityId.split(".")[0];
  return (NUMERIC_DOMAINS as readonly string[]).includes(domain);
}

/**
 * Returns true if the given entity state represents an active/on condition.
 *
 * @param state - The entity state string
 * @returns Whether the entity is considered active
 */
export function isEntityActive(state: string): boolean {
  return (ON_STATES as readonly string[]).includes(state);
}

/**
 * Derives a default MDI icon string from an entity state object based on its domain.
 *
 * @param entityState - The HA entity state object
 * @returns An MDI icon string
 */
export function deriveDefaultIcon(entityState: HassEntity): string {
  const domain = entityState.entity_id.split(".")[0];
  return DOMAIN_ICON_MAP[domain] ?? "mdi:power";
}

/**
 * Resolves a HA action config and fires the appropriate event or service call.
 *
 * @param element - The card element to dispatch events from
 * @param hass - The Home Assistant object
 * @param config - The full card config
 * @param action - The action config to execute
 */
export function handleAction(
  element: EventTarget,
  hass: HomeAssistant,
  config: ButtonProgressCardConfig,
  action: ActionConfig | undefined
): void {
  if (!action || action.action === "none") return;

  switch (action.action) {
    case "toggle":
      hass.callService("homeassistant", "toggle", { entity_id: config.entity });
      break;

    case "more-info":
      element.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: config.entity },
        })
      );
      break;

    case "call-service":
    case "perform-action": {
      const serviceAction = action.perform_action ?? action.service;
      if (!serviceAction) return;
      const [domain, service] = serviceAction.split(".");
      hass.callService(domain, service, action.target ?? action.service_data ?? {});
      break;
    }

    case "navigate":
      if (action.navigation_path) {
        window.history.pushState(null, "", action.navigation_path);
        window.dispatchEvent(
          new CustomEvent("location-changed", { bubbles: true, composed: true })
        );
      }
      break;

    case "url":
      if (action.url_path) {
        window.open(action.url_path);
      }
      break;
  }
}

/**
 * Parses a timer duration string in HH:MM:SS format into milliseconds.
 *
 * @param duration - Duration string in HH:MM:SS format
 * @returns Duration in milliseconds
 */
export function parseDurationToMs(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [hours, minutes, seconds] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}