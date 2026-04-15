import { css, LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const CARD_VERSION = "1.0.0";
const CARD_TAG_NAME = "button-progress-card";
const EDITOR_TAG_NAME = "button-progress-card-editor";
const TIMER_DOMAIN = "timer";
const NUMERIC_DOMAINS = ["input_number", "number", "counter", "sensor"];
const DEFAULT_CONFIG = {
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
const HOLD_THRESHOLD_MS = 500;
const DOUBLE_TAP_THRESHOLD_MS = 300;
const DOMAIN_ICON_MAP = {
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
const ON_STATES = ["on", "active", "playing", "open", "unlocked", "home"];

/**
 * Returns true if the entity ID belongs to the timer domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is a timer
 */
function isTimerEntity(entityId) {
    return entityId.split(".")[0] === TIMER_DOMAIN;
}
/**
 * Returns true if the entity ID belongs to a supported numeric domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is numeric
 */
function isNumericEntity(entityId) {
    const domain = entityId.split(".")[0];
    return NUMERIC_DOMAINS.includes(domain);
}
/**
 * Returns true if the given entity state represents an active/on condition.
 *
 * @param state - The entity state string
 * @returns Whether the entity is considered active
 */
function isEntityActive(state) {
    return ON_STATES.includes(state);
}
/**
 * Derives a default MDI icon string from an entity state object based on its domain.
 *
 * @param entityState - The HA entity state object
 * @returns An MDI icon string
 */
function deriveDefaultIcon(entityState) {
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
function handleAction(element, hass, config, action) {
    if (!action || action.action === "none")
        return;
    switch (action.action) {
        case "toggle":
            hass.callService("homeassistant", "toggle", { entity_id: config.entity });
            break;
        case "more-info":
            element.dispatchEvent(new CustomEvent("hass-more-info", {
                bubbles: true,
                composed: true,
                detail: { entityId: config.entity },
            }));
            break;
        case "call-service":
        case "perform-action": {
            const serviceAction = action.perform_action ?? action.service;
            if (!serviceAction)
                return;
            const [domain, service] = serviceAction.split(".");
            hass.callService(domain, service, action.target ?? action.service_data ?? {});
            break;
        }
        case "navigate":
            if (action.navigation_path) {
                window.history.pushState(null, "", action.navigation_path);
                window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
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
function parseDurationToMs(duration) {
    const parts = duration.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN))
        return 0;
    const [hours, minutes, seconds] = parts;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Config editor element for button-progress-card.
 * Renders the HA form schema used in the Lovelace card editor UI.
 */
class ButtonProgressCardEditor extends LitElement {
    constructor() {
        super(...arguments);
        this._schema = [
            {
                name: "entity",
                selector: { entity: {} },
            },
            {
                name: "name",
                selector: { text: {} },
            },
            {
                name: "icon",
                selector: { icon: {} },
            },
            {
                name: "timer_entity",
                selector: { entity: {} },
            },
            {
                name: "bar_color",
                selector: { text: {} },
            },
            {
                name: "bar_height",
                selector: { number: { min: 1, max: 20, mode: "slider" } },
            },
            {
                name: "reverse",
                selector: { boolean: {} },
            },
            {
                name: "bar_min",
                selector: { number: { mode: "box" } },
            },
            {
                name: "bar_max",
                selector: { number: { mode: "box" } },
            },
            {
                name: "tap_action",
                selector: { ui_action: {} },
            },
            {
                name: "hold_action",
                selector: { ui_action: {} },
            },
            {
                name: "double_tap_action",
                selector: { ui_action: {} },
            },
        ];
        this._computeLabel = (schema) => {
            const labels = {
                entity: "Entity",
                name: "Name",
                icon: "Icon",
                timer_entity: "Progress bar entity (timer or numeric)",
                bar_color: "Bar color",
                bar_height: "Bar height (px)",
                reverse: "Reverse bar direction (full → empty)",
                bar_min: "Bar minimum value (numeric entities)",
                bar_max: "Bar maximum value (numeric entities)",
                tap_action: "Tap action",
                hold_action: "Hold action",
                double_tap_action: "Double tap action",
            };
            return labels[schema.name] ?? schema.name;
        };
        this._computeHelper = (schema) => {
            const helpers = {
                entity: "The entity this button controls.",
                name: "Display name. Leave empty to use the entity friendly name.",
                icon: "Icon to display. Leave empty to use the entity default icon.",
                timer_entity: "Optional. A timer.* entity for animated countdown, or a numeric entity (input_number, number, counter, sensor) for value-based progress.",
                bar_color: "CSS color value for the progress bar. Default: var(--accent-color).",
                bar_height: "Height of the progress bar in pixels.",
                reverse: "When enabled the bar starts full and shrinks (countdown). When disabled the bar starts empty and grows.",
                bar_min: "Minimum value for numeric entity progress bar. Used if the entity does not expose a min attribute.",
                bar_max: "Maximum value for numeric entity progress bar. Used if the entity does not expose a max attribute.",
                tap_action: "Action to perform on single tap.",
                hold_action: "Action to perform on long press.",
                double_tap_action: "Action to perform on double tap.",
            };
            return helpers[schema.name];
        };
    }
    /**
     * Sets the card configuration for the editor.
     *
     * @param config - The current card configuration
     */
    setConfig(config) {
        this._config = config;
    }
    /**
     * Handles config change events from the HA form and dispatches
     * a config-changed event to notify the Lovelace editor.
     *
     * @param event - The config-changed custom event from ha-form
     */
    _onConfigChanged(event) {
        event.stopPropagation();
        const updatedConfig = {
            ...this._config,
            ...event.detail.value,
        };
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: updatedConfig },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.hass || !this._config)
            return html ``;
        return html `
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._onConfigChanged}
      ></ha-form>
    `;
    }
}
ButtonProgressCardEditor.styles = css `
    :host {
      display: block;
    }
  `;
__decorate([
    property({ attribute: false })
], ButtonProgressCardEditor.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], ButtonProgressCardEditor.prototype, "_config", void 0);
if (!customElements.get(EDITOR_TAG_NAME)) {
    customElements.define(EDITOR_TAG_NAME, ButtonProgressCardEditor);
}

/**
 * ButtonProgressCard — A generic toggle button with an optional animated
 * progress bar driven by a timer or numeric entity.
 */
class ButtonProgressCard extends LitElement {
    constructor() {
        super(...arguments);
        this._progressPercentage = 0;
        this._barVisible = false;
        this._animationFrameId = null;
        this._pressTimer = null;
        this._lastTapTime = 0;
        this._holdFired = false;
    }
    /**
     * Sets the card configuration, merging with defaults.
     *
     * @param config - The user-provided card configuration
     */
    setConfig(config) {
        if (!config.entity) {
            throw new Error("entity is required");
        }
        this._config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Returns the editor element tag name for the Lovelace UI editor.
     */
    static getConfigElement() {
        return document.createElement(EDITOR_TAG_NAME);
    }
    /**
     * Returns a stub config for the card picker preview.
     */
    static getStubConfig() {
        return {
            entity: "light.example",
            timer_entity: "",
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
    }
    updated(changedProperties) {
        if (changedProperties.has("hass")) {
            this._updateProgressBar();
        }
    }
    /**
     * Evaluates the progress bar entity and delegates to the appropriate
     * update handler based on entity domain.
     */
    _updateProgressBar() {
        const timerEntityId = this._config?.timer_entity;
        if (!timerEntityId || !this.hass) {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        const barEntityState = this.hass.states[timerEntityId];
        if (!barEntityState) {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        if (isTimerEntity(timerEntityId)) {
            this._updateTimerBar(barEntityState.state, barEntityState.attributes);
        }
        else if (isNumericEntity(timerEntityId)) {
            this._updateNumericBar(barEntityState.state, barEntityState.attributes);
        }
        else {
            this._barVisible = false;
            this._cancelAnimation();
        }
    }
    /**
     * Starts or maintains an animated countdown progress bar for a timer entity.
     * Uses requestAnimationFrame for smooth animation.
     *
     * @param state - Current timer state string
     * @param attributes - Timer entity attributes
     */
    _updateTimerBar(state, attributes) {
        if (state !== "active") {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        this._barVisible = true;
        if (this._animationFrameId !== null)
            return;
        const finishesAt = new Date(attributes.finishes_at).getTime();
        const durationMs = parseDurationToMs(attributes.duration);
        if (durationMs === 0)
            return;
        const animate = () => {
            const remaining = finishesAt - Date.now();
            const clampedRemaining = Math.max(0, Math.min(durationMs, remaining));
            const percentage = (clampedRemaining / durationMs) * 100;
            this._progressPercentage = this._config?.reverse ?? true
                ? percentage
                : 100 - percentage;
            if (remaining > 0) {
                this._animationFrameId = requestAnimationFrame(animate);
            }
            else {
                this._animationFrameId = null;
                this._barVisible = false;
                this._progressPercentage = 0;
            }
        };
        this._animationFrameId = requestAnimationFrame(animate);
    }
    /**
     * Updates the progress bar percentage for a numeric entity based on
     * its current value relative to configured or attribute-defined min/max.
     *
     * @param state - Current numeric entity state string
     * @param attributes - Numeric entity attributes
     */
    _updateNumericBar(state, attributes) {
        const currentValue = parseFloat(state);
        if (isNaN(currentValue)) {
            this._barVisible = false;
            return;
        }
        const minValue = attributes.min ?? this._config?.bar_min ?? 0;
        const maxValue = attributes.max ?? this._config?.bar_max ?? 100;
        if (maxValue === minValue) {
            this._barVisible = false;
            return;
        }
        const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        this._progressPercentage = this._config?.reverse ?? true
            ? 100 - clampedPercentage
            : clampedPercentage;
        this._barVisible = true;
    }
    /**
     * Cancels any active requestAnimationFrame animation loop.
     */
    _cancelAnimation() {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
    }
    /**
     * Handles pointer down — starts hold timer.
     */
    _onPointerDown() {
        this._holdFired = false;
        this._pressTimer = setTimeout(() => {
            this._holdFired = true;
            if (this._config && this.hass) {
                handleAction(this, this.hass, this._config, this._config.hold_action);
            }
        }, HOLD_THRESHOLD_MS);
    }
    /**
     * Handles pointer up — fires tap or double-tap action.
     */
    _onPointerUp() {
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
            this._pressTimer = null;
        }
        if (this._holdFired)
            return;
        const now = Date.now();
        const timeSinceLastTap = now - this._lastTapTime;
        if (timeSinceLastTap < DOUBLE_TAP_THRESHOLD_MS) {
            this._lastTapTime = 0;
            if (this._config && this.hass) {
                handleAction(this, this.hass, this._config, this._config.double_tap_action);
            }
        }
        else {
            this._lastTapTime = now;
            setTimeout(() => {
                if (this._lastTapTime === now && this._config && this.hass) {
                    handleAction(this, this.hass, this._config, this._config.tap_action);
                }
            }, DOUBLE_TAP_THRESHOLD_MS);
        }
    }
    /**
     * Handles pointer leave — cancels hold timer.
     */
    _onPointerLeave() {
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
            this._pressTimer = null;
        }
    }
    render() {
        if (!this._config || !this.hass)
            return html ``;
        const entityState = this.hass.states[this._config.entity];
        if (!entityState)
            return html `<ha-card></ha-card>`;
        const isOn = isEntityActive(entityState.state);
        const name = this._config.name || entityState.attributes.friendly_name || this._config.entity;
        const icon = this._config.icon || entityState.attributes.icon || deriveDefaultIcon(entityState);
        const barColor = this._config.bar_color ?? "var(--accent-color)";
        const barHeight = this._config.bar_height ?? 4;
        return html `
      <ha-card
        style="--bpc-bar-color: ${barColor}; --bpc-bar-height: ${barHeight}px;"
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="bpc-background"></div>
        <div class="bpc-state-overlay ${isOn ? "is-on" : ""}"></div>
        <div class="bpc-content">
          <div class="bpc-icon-container ${isOn ? "is-on" : ""}">
            <ha-icon class="bpc-icon ${isOn ? "is-on" : ""}" .icon=${icon}></ha-icon>
          </div>
          <span class="bpc-name ${isOn ? "is-on" : ""}">${name}</span>
        </div>
        ${this._barVisible
            ? html `
              <div class="bpc-progress-bar">
                <div
                  class="bpc-progress-fill"
                  style="width: ${this._progressPercentage}%"
                ></div>
              </div>
            `
            : ""}
      </ha-card>
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._cancelAnimation();
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
        }
    }
    getCardSize() {
        return 1;
    }
}
ButtonProgressCard.styles = css `
    :host {
      display: block;
    }

    ha-card {
      position: relative;
      display: flex;
      align-items: center;
      height: calc(
        var(--row-height, 56px) * var(--row-size, 1) +
        var(--row-gap, 8px) * (var(--row-size, 1) - 1)
      );
      min-height: 50px;
      padding: 0;
      border-radius: var(--bubble-border-radius, var(--ha-card-border-radius, 28px));
      overflow: hidden;
      cursor: pointer;
      box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
      border: var(--bubble-border, none);
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: background-color 0.4s ease;
    }

    .bpc-background {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: var(
        --bubble-button-main-background-color,
        var(--secondary-background-color)
      );
      pointer-events: none;
      z-index: 0;
    }

    .bpc-state-overlay {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: transparent;
      pointer-events: none;
      z-index: 1;
      transition: background-color 0.4s ease;
    }

    .bpc-state-overlay.is-on {
      background-color: var(--accent-color);
    }

    .bpc-content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }

    .bpc-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      min-height: 42px;
      width: 42px;
      height: 42px;
      margin-left: 8px;
      border-radius: var(--bubble-icon-border-radius, 50%);
      background-color: var(
        --bubble-icon-background-color,
        var(--secondary-background-color)
      );
      flex-shrink: 0;
      transition: background-color 0.4s ease;
      overflow: hidden;
    }

    .bpc-icon-container.is-on {
      background-color: rgba(255, 255, 255, 0.15);
    }

    .bpc-icon {
      --mdc-icon-size: 24px;
      color: var(--state-icon-color);
      opacity: 0.6;
      transition: color 0.4s ease, opacity 0.4s ease;
    }

    .bpc-icon.is-on {
      color: var(--primary-background-color);
      opacity: 1;
    }

    .bpc-name {
      flex-grow: 1;
      margin: 0 16px 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.4s ease;
      pointer-events: none;
    }

    .bpc-name.is-on {
      color: var(--primary-background-color);
    }

    .bpc-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: var(--bpc-bar-height, 4px);
      background-color: color-mix(
        in srgb,
        var(--bpc-bar-color, var(--accent-color)) 25%,
        transparent
      );
      pointer-events: none;
      z-index: 3;
    }

    .bpc-progress-fill {
      height: 100%;
      width: 0%;
      background-color: var(--bpc-bar-color, var(--accent-color));
      will-change: width;
    }
  `;
__decorate([
    property({ attribute: false })
], ButtonProgressCard.prototype, "hass", void 0);
__decorate([
    state()
], ButtonProgressCard.prototype, "_config", void 0);
__decorate([
    state()
], ButtonProgressCard.prototype, "_progressPercentage", void 0);
__decorate([
    state()
], ButtonProgressCard.prototype, "_barVisible", void 0);
if (!customElements.get(CARD_TAG_NAME)) {
    customElements.define(CARD_TAG_NAME, ButtonProgressCard);
}
window.customCards = window.customCards || [];
window.customCards.push({
    type: CARD_TAG_NAME,
    name: "Button Progress Card",
    preview: true,
    description: "A generic toggle button with an optional animated progress bar driven by a timer or numeric entity.",
});
console.info(`%c BUTTON-PROGRESS-CARD %c v${CARD_VERSION} `, "color: white; background: #4a90e2; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;", "color: #4a90e2; background: white; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");
//# sourceMappingURL=button-progress-card.js.map