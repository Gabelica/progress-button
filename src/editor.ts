import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import type { ButtonProgressCardConfig, HomeAssistant } from "./types";
import { EDITOR_TAG_NAME } from "./constants";

/**
 * Config editor element for button-progress-card.
 * Renders the HA form schema used in the Lovelace card editor UI.
 */
class ButtonProgressCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) private _config?: ButtonProgressCardConfig;

  static styles = css`
    :host {
      display: block;
    }
  `;

  /**
   * Sets the card configuration for the editor.
   *
   * @param config - The current card configuration
   */
  public setConfig(config: ButtonProgressCardConfig): void {
    this._config = config;
  }

  /**
   * Handles config change events from the HA form and dispatches
   * a config-changed event to notify the Lovelace editor.
   *
   * @param event - The config-changed custom event from ha-form
   */
  private _onConfigChanged(event: CustomEvent): void {
    event.stopPropagation();
    const updatedConfig: ButtonProgressCardConfig = {
      ...this._config,
      ...event.detail.value,
    };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: updatedConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected render() {
    if (!this.hass || !this._config) return html``;

    return html`
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

  private readonly _schema = [
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
  ] as const;

  private readonly _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
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

  private readonly _computeHelper = (schema: { name: string }): string | undefined => {
    const helpers: Record<string, string> = {
      entity: "The entity this button controls.",
      name: "Display name. Leave empty to use the entity friendly name.",
      icon: "Icon to display. Leave empty to use the entity default icon.",
      timer_entity:
        "Optional. A timer.* entity for animated countdown, or a numeric entity (input_number, number, counter, sensor) for value-based progress.",
      bar_color: "CSS color value for the progress bar. Default: var(--accent-color).",
      bar_height: "Height of the progress bar in pixels.",
      reverse:
        "When enabled the bar starts full and shrinks (countdown). When disabled the bar starts empty and grows.",
      bar_min:
        "Minimum value for numeric entity progress bar. Used if the entity does not expose a min attribute.",
      bar_max:
        "Maximum value for numeric entity progress bar. Used if the entity does not expose a max attribute.",
      tap_action: "Action to perform on single tap.",
      hold_action: "Action to perform on long press.",
      double_tap_action: "Action to perform on double tap.",
    };
    return helpers[schema.name];
  };
}

if (!customElements.get(EDITOR_TAG_NAME)) {
  customElements.define(EDITOR_TAG_NAME, ButtonProgressCardEditor);
}