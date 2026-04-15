// SPDX-License-Identifier: MIT
// button-timer-card — A generic toggle button with an optional animated progress bar.
// Supports timer entities (animated countdown) and numeric entities (value-based progress).

const CARD_VERSION = "1.0.0";

const DEFAULT_CONFIG = {
  entity: "",
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

const TIMER_DOMAIN = "timer";
const NUMERIC_DOMAINS = ["input_number", "number", "counter", "sensor"];

/**
 * Determines if a given entity ID belongs to a timer domain.
 *
 * @param {string} entityId
 * @returns {boolean}
 */
function isTimerEntity(entityId) {
  return entityId && entityId.split(".")[0] === TIMER_DOMAIN;
}

/**
 * Determines if a given entity ID belongs to a numeric domain.
 *
 * @param {string} entityId
 * @returns {boolean}
 */
function isNumericEntity(entityId) {
  return entityId && NUMERIC_DOMAINS.includes(entityId.split(".")[0]);
}

/**
 * Resolves a HA action object and fires the appropriate event or service call.
 *
 * @param {HTMLElement} element - The card element to dispatch events from
 * @param {Object} hass - The Home Assistant object
 * @param {Object} config - The card config
 * @param {Object} action - The action config object
 */
function handleAction(element, hass, config, action) {
  if (!action || action.action === "none") return;

  if (action.action === "toggle") {
    hass.callService("homeassistant", "toggle", { entity_id: config.entity });
    return;
  }

  if (action.action === "more-info") {
    element.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: config.entity },
      })
    );
    return;
  }

  if (action.action === "call-service" || action.action === "perform-action") {
    const serviceAction = action.perform_action || action.service;
    if (!serviceAction) return;
    const [domain, service] = serviceAction.split(".");
    hass.callService(domain, service, action.target || action.service_data || {});
    return;
  }

  if (action.action === "navigate") {
    window.history.pushState(null, "", action.navigation_path);
    window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    return;
  }

  if (action.action === "url") {
    if (action.url_path) window.open(action.url_path);
    return;
  }
}

class ButtonTimerCard extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._animationFrameId = null;
    this._pressTimer = null;
    this._pressStartTime = null;
    this._hasFired = false;
    this._initialized = false;
  }

  /**
   * Sets the Home Assistant object and triggers a render update.
   *
   * @param {Object} hass - The Home Assistant object
   */
  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._initializeCard();
    }
    this._updateCard();
  }

  /**
   * Sets the card configuration, merging with defaults.
   *
   * @param {Object} config - The user-provided card configuration
   */
  setConfig(config) {
    if (!config.entity) {
      throw new Error("entity is required");
    }
    this._config = Object.assign({}, DEFAULT_CONFIG, config);
    if (this._initialized) {
      this._updateCard();
    }
  }

  /**
   * Initializes the card DOM structure and attaches event listeners.
   */
  _initializeCard() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }

        ha-card {
          position: relative;
          display: flex;
          align-items: center;
          height: calc(var(--row-height, 56px) * var(--row-size, 1) + var(--row-gap, 8px) * (var(--row-size, 1) - 1));
          min-height: 50px;
          padding: 0;
          border-radius: var(--bubble-border-radius, var(--ha-card-border-radius, 28px));
          background-color: var(--btc-bg, var(--bubble-button-main-background-color, var(--secondary-background-color)));
          overflow: hidden;
          cursor: pointer;
          transition: background-color 0.4s ease;
          box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
          border: var(--bubble-border, none);
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .btc-background {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-color: var(--btc-state-bg, transparent);
          transition: background-color 0.4s ease;
          pointer-events: none;
        }

        .btc-ripple {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }

        .btc-content {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .btc-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 42px;
          min-height: 42px;
          width: 42px;
          height: 42px;
          margin-left: 8px;
          border-radius: var(--bubble-icon-border-radius, 50%);
          background-color: var(--btc-icon-bg, var(--bubble-icon-background-color, var(--secondary-background-color)));
          flex-shrink: 0;
          transition: background-color 0.4s ease;
          overflow: hidden;
        }

        .btc-icon {
          --mdc-icon-size: 24px;
          color: var(--btc-icon-color, var(--state-icon-color));
          transition: color 0.4s ease, opacity 0.4s ease;
          opacity: 0.6;
        }

        .btc-icon.is-on {
          opacity: 1;
        }

        .btc-name {
          flex-grow: 1;
          margin: 0 16px 0 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--btc-text-color, var(--primary-text-color));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.4s ease;
          pointer-events: none;
        }

        .btc-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: var(--btc-bar-height, 4px);
          background-color: color-mix(in srgb, var(--btc-bar-color, var(--accent-color)) 25%, transparent);
          pointer-events: none;
          z-index: 2;
        }

        .btc-progress-fill {
          height: 100%;
          width: 0%;
          background-color: var(--btc-bar-color, var(--accent-color));
          transition: width 0.1s linear;
          will-change: width;
        }

        .btc-progress-bar.hidden {
          display: none;
        }
      </style>
      <ha-card>
        <div class="btc-background"></div>
        <div class="btc-ripple"></div>
        <div class="btc-content">
          <div class="btc-icon-container">
            <ha-icon class="btc-icon" id="btc-icon"></ha-icon>
          </div>
          <span class="btc-name" id="btc-name"></span>
        </div>
        <div class="btc-progress-bar hidden" id="btc-bar">
          <div class="btc-progress-fill" id="btc-fill"></div>
        </div>
      </ha-card>
    `;

    this._haCard = this.querySelector("ha-card");
    this._iconEl = this.querySelector("#btc-icon");
    this._nameEl = this.querySelector("#btc-name");
    this._barEl = this.querySelector("#btc-bar");
    this._fillEl = this.querySelector("#btc-fill");

    this._attachEventListeners();
    this._initialized = true;
  }

  /**
   * Attaches pointer event listeners for tap, hold, and double-tap detection.
   */
  _attachEventListeners() {
    let lastTapTime = 0;
    const HOLD_THRESHOLD_MS = 500;
    const DOUBLE_TAP_THRESHOLD_MS = 300;

    this._haCard.addEventListener("pointerdown", () => {
      this._hasFired = false;
      this._pressStartTime = Date.now();
      this._pressTimer = setTimeout(() => {
        this._hasFired = true;
        handleAction(this, this._hass, this._config, this._config.hold_action);
      }, HOLD_THRESHOLD_MS);
    });

    this._haCard.addEventListener("pointerup", () => {
      clearTimeout(this._pressTimer);
      if (this._hasFired) return;

      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime;

      if (timeSinceLastTap < DOUBLE_TAP_THRESHOLD_MS) {
        lastTapTime = 0;
        handleAction(this, this._hass, this._config, this._config.double_tap_action);
      } else {
        lastTapTime = now;
        setTimeout(() => {
          if (lastTapTime === now) {
            handleAction(this, this._hass, this._config, this._config.tap_action);
          }
        }, DOUBLE_TAP_THRESHOLD_MS);
      }
    });

    this._haCard.addEventListener("pointerleave", () => {
      clearTimeout(this._pressTimer);
    });
  }

  /**
   * Updates all card visual elements based on current entity and timer state.
   */
  _updateCard() {
    if (!this._config || !this._hass || !this._initialized) return;

    const entityState = this._hass.states[this._config.entity];
    if (!entityState) return;

    const isOn = entityState.state === "on" || entityState.state === "active" || entityState.state === "playing";
    const friendlyName = this._config.name || entityState.attributes.friendly_name || this._config.entity;
    const icon = this._config.icon || entityState.attributes.icon || this._deriveIcon(entityState);

    this._nameEl.textContent = friendlyName;
    this._iconEl.setAttribute("icon", icon);

    const barColor = this._config.bar_color || "var(--accent-color)";
    const barHeight = this._config.bar_height || 4;

    this.style.setProperty("--btc-bar-color", barColor);
    this.style.setProperty("--btc-bar-height", `${barHeight}px`);

    if (isOn) {
      this.style.setProperty("--btc-state-bg", "var(--accent-color)");
      this.style.setProperty("--btc-text-color", "var(--primary-background-color)");
      this.style.setProperty("--btc-icon-color", "var(--primary-background-color)");
      this.style.setProperty("--btc-icon-bg", "rgba(255,255,255,0.15)");
      this._iconEl.classList.add("is-on");
    } else {
      this.style.setProperty("--btc-state-bg", "transparent");
      this.style.setProperty("--btc-text-color", "var(--primary-text-color)");
      this.style.setProperty("--btc-icon-color", "var(--state-icon-color)");
      this.style.setProperty("--btc-icon-bg", "var(--bubble-icon-background-color, var(--secondary-background-color))");
      this._iconEl.classList.remove("is-on");
    }

    this._updateProgressBar();
  }

  /**
   * Derives a default icon string from an entity state object based on domain.
   *
   * @param {Object} entityState - The HA entity state object
   * @returns {string} MDI icon string
   */
  _deriveIcon(entityState) {
    const domain = entityState.entity_id.split(".")[0];
    const iconMap = {
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
    return iconMap[domain] || "mdi:power";
  }

  /**
   * Updates the progress bar based on the configured bar entity type.
   * Handles timer entities with animation and numeric entities with value-based progress.
   */
  _updateProgressBar() {
    const barEntityId = this._config.timer_entity;

    if (!barEntityId) {
      this._hideBar();
      return;
    }

    const barEntityState = this._hass.states[barEntityId];
    if (!barEntityState) {
      this._hideBar();
      return;
    }

    if (isTimerEntity(barEntityId)) {
      this._updateTimerBar(barEntityState);
    } else if (isNumericEntity(barEntityId)) {
      this._updateNumericBar(barEntityState);
    } else {
      this._hideBar();
    }
  }

  /**
   * Handles animated progress bar updates for timer entities using requestAnimationFrame.
   * Cancels any existing animation loop before starting a new one.
   *
   * @param {Object} timerState - The HA state object for the timer entity
   */
  _updateTimerBar(timerState) {
    if (timerState.state !== "active") {
      this._hideBar();
      this._cancelAnimation();
      return;
    }

    this._showBar();

    const finishesAt = new Date(timerState.attributes.finishes_at).getTime();
    const durationParts = timerState.attributes.duration.split(":");
    const durationMs =
      (parseInt(durationParts[0]) * 3600 +
        parseInt(durationParts[1]) * 60 +
        parseInt(durationParts[2])) *
      1000;

    if (this._animationFrameId === null) {
      const animate = () => {
        const remaining = finishesAt - Date.now();
        const clampedRemaining = Math.max(0, Math.min(durationMs, remaining));
        const percentage = (clampedRemaining / durationMs) * 100;
        const displayPercentage = this._config.reverse ? percentage : 100 - percentage;

        if (this._fillEl) {
          this._fillEl.style.width = `${displayPercentage}%`;
        }

        if (remaining > 0) {
          this._animationFrameId = requestAnimationFrame(animate);
        } else {
          this._animationFrameId = null;
          this._hideBar();
        }
      };

      this._animationFrameId = requestAnimationFrame(animate);
    }
  }

  /**
   * Handles progress bar updates for numeric entities based on min/max/current value.
   *
   * @param {Object} numericState - The HA state object for the numeric entity
   */
  _updateNumericBar(numericState) {
    const currentValue = parseFloat(numericState.state);

    if (isNaN(currentValue)) {
      this._hideBar();
      return;
    }

    const minValue = parseFloat(
      numericState.attributes.min !== undefined
        ? numericState.attributes.min
        : this._config.bar_min
    );
    const maxValue = parseFloat(
      numericState.attributes.max !== undefined
        ? numericState.attributes.max
        : this._config.bar_max
    );

    if (maxValue === minValue) {
      this._hideBar();
      return;
    }

    const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    const displayPercentage = this._config.reverse ? 100 - clampedPercentage : clampedPercentage;

    this._showBar();
    if (this._fillEl) {
      this._fillEl.style.width = `${displayPercentage}%`;
    }
  }

  /**
   * Shows the progress bar element.
   */
  _showBar() {
    if (this._barEl) {
      this._barEl.classList.remove("hidden");
    }
  }

  /**
   * Hides the progress bar element.
   */
  _hideBar() {
    if (this._barEl) {
      this._barEl.classList.add("hidden");
    }
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

  disconnectedCallback() {
    this._cancelAnimation();
    clearTimeout(this._pressTimer);
  }

  getCardSize() {
    return 1;
  }

  static getStubConfig() {
    return {
      entity: "light.example",
      timer_entity: "",
      name: "",
      icon: "",
      bar_color: "var(--accent-color)",
      bar_height: 4,
      reverse: true,
      tap_action: { action: "toggle" },
      hold_action: { action: "more-info" },
      double_tap_action: { action: "none" },
    };
  }

  static getConfigForm() {
    return {
      schema: [
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
      ],
      computeLabel: (schema) => {
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
        return labels[schema.name] || schema.name;
      },
      computeHelper: (schema) => {
        const helpers = {
          entity: "The entity this button controls.",
          name: "Display name. Leave empty to use the entity friendly name.",
          icon: "Icon to display. Leave empty to use the entity default icon.",
          timer_entity: "Optional. A timer.* entity for animated countdown, or a numeric entity (input_number, number, counter, sensor) for value-based progress.",
          bar_color: "CSS color value for the progress bar. Default: var(--accent-color).",
          bar_height: "Height of the progress bar in pixels.",
          reverse: "When enabled, the bar starts full and shrinks (countdown). When disabled, the bar starts empty and grows.",
          bar_min: "Minimum value for numeric entity progress bar. Used if the entity does not expose a min attribute.",
          bar_max: "Maximum value for numeric entity progress bar. Used if the entity does not expose a max attribute.",
          tap_action: "Action to perform on single tap.",
          hold_action: "Action to perform on long press.",
          double_tap_action: "Action to perform on double tap.",
        };
        return helpers[schema.name] || undefined;
      },
      assertConfig: (config) => {
        if (!config.entity) {
          throw new Error("entity is required");
        }
        if (config.bar_height !== undefined) {
          if (typeof config.bar_height !== "number" || config.bar_height < 1 || config.bar_height > 20) {
            throw new Error("bar_height must be a number between 1 and 20");
          }
        }
        if (config.bar_min !== undefined && typeof config.bar_min !== "number") {
          throw new Error("bar_min must be a number");
        }
        if (config.bar_max !== undefined && typeof config.bar_max !== "number") {
          throw new Error("bar_max must be a number");
        }
        if (
          config.bar_min !== undefined &&
          config.bar_max !== undefined &&
          config.bar_min >= config.bar_max
        ) {
          throw new Error("bar_min must be less than bar_max");
        }
      },
    };
  }
}

if (!customElements.get("button-timer-card")) {
  customElements.define("button-timer-card", ButtonTimerCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "button-timer-card",
  name: "Button Timer Card",
  preview: true,
  description: "A generic toggle button with an optional animated progress bar driven by a timer or numeric entity.",
});

console.info(
  `%c BUTTON-TIMER-CARD %c v${CARD_VERSION} `,
  "color: white; background: #4a90e2; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;",
  "color: #4a90e2; background: white; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"
);