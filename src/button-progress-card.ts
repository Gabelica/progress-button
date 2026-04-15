import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type { ButtonProgressCardConfig, HomeAssistant, TimerAttributes, NumericAttributes } from "./types";
import {
  CARD_VERSION,
  CARD_TAG_NAME,
  EDITOR_TAG_NAME,
  DEFAULT_CONFIG,
  HOLD_THRESHOLD_MS,
  DOUBLE_TAP_THRESHOLD_MS,
} from "./constants";
import {
  isTimerEntity,
  isNumericEntity,
  isEntityActive,
  deriveDefaultIcon,
  handleAction,
  parseDurationToMs,
} from "./utils";
import "./editor";

/**
 * ButtonProgressCard — A generic toggle button with an optional animated
 * progress bar driven by a timer or numeric entity.
 */
class ButtonProgressCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: ButtonProgressCardConfig;
  @state() private _progressPercentage: number = 0;
  @state() private _barVisible: boolean = false;

  private _animationFrameId: number | null = null;
  private _pressTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastTapTime: number = 0;
  private _holdFired: boolean = false;

  static styles = css`
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

  /**
   * Sets the card configuration, merging with defaults.
   *
   * @param config - The user-provided card configuration
   */
  public setConfig(config: ButtonProgressCardConfig): void {
    if (!config.entity) {
      throw new Error("entity is required");
    }
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Returns the editor element tag name for the Lovelace UI editor.
   */
  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG_NAME);
  }

  /**
   * Returns a stub config for the card picker preview.
   */
  public static getStubConfig(): ButtonProgressCardConfig {
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

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("hass")) {
      this._updateProgressBar();
    }
  }

  /**
   * Evaluates the progress bar entity and delegates to the appropriate
   * update handler based on entity domain.
   */
  private _updateProgressBar(): void {
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
      this._updateTimerBar(barEntityState.state, barEntityState.attributes as unknown as TimerAttributes);
    } else if (isNumericEntity(timerEntityId)) {
      this._updateNumericBar(barEntityState.state, barEntityState.attributes as unknown as NumericAttributes);
    } else {
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
  private _updateTimerBar(state: string, attributes: TimerAttributes): void {
    if (state !== "active") {
      this._barVisible = false;
      this._cancelAnimation();
      return;
    }

    this._barVisible = true;

    if (this._animationFrameId !== null) return;

    const finishesAt = new Date(attributes.finishes_at).getTime();
    const durationMs = parseDurationToMs(attributes.duration);

    if (durationMs === 0) return;

    const animate = (): void => {
      const remaining = finishesAt - Date.now();
      const clampedRemaining = Math.max(0, Math.min(durationMs, remaining));
      const percentage = (clampedRemaining / durationMs) * 100;

      this._progressPercentage = this._config?.reverse ?? true
        ? percentage
        : 100 - percentage;

      if (remaining > 0) {
        this._animationFrameId = requestAnimationFrame(animate);
      } else {
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
  private _updateNumericBar(state: string, attributes: NumericAttributes): void {
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
  private _cancelAnimation(): void {
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  /**
   * Handles pointer down — starts hold timer.
   */
  private _onPointerDown(): void {
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
  private _onPointerUp(): void {
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }

    if (this._holdFired) return;

    const now = Date.now();
    const timeSinceLastTap = now - this._lastTapTime;

    if (timeSinceLastTap < DOUBLE_TAP_THRESHOLD_MS) {
      this._lastTapTime = 0;
      if (this._config && this.hass) {
        handleAction(this, this.hass, this._config, this._config.double_tap_action);
      }
    } else {
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
  private _onPointerLeave(): void {
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }
  }

  protected render() {
    if (!this._config || !this.hass) return html``;

    const entityState = this.hass.states[this._config.entity];
    if (!entityState) return html`<ha-card></ha-card>`;

    const isOn = isEntityActive(entityState.state);
    const name = this._config.name || (entityState.attributes.friendly_name as string) || this._config.entity;
    const icon = this._config.icon || (entityState.attributes.icon as string) || deriveDefaultIcon(entityState);
    const barColor = this._config.bar_color ?? "var(--accent-color)";
    const barHeight = this._config.bar_height ?? 4;

    return html`
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
          ? html`
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

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cancelAnimation();
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
    }
  }

  getCardSize(): number {
    return 1;
  }
}

if (!customElements.get(CARD_TAG_NAME)) {
  customElements.define(CARD_TAG_NAME, ButtonProgressCard);
}

window.customCards = window.customCards || [];
(window.customCards as Array<Record<string, unknown>>).push({
  type: CARD_TAG_NAME,
  name: "Button Progress Card",
  preview: true,
  description:
    "A generic toggle button with an optional animated progress bar driven by a timer or numeric entity.",
});

console.info(
  `%c BUTTON-PROGRESS-CARD %c v${CARD_VERSION} `,
  "color: white; background: #4a90e2; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;",
  "color: #4a90e2; background: white; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"
);