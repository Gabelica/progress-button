import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  ha-card {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 50px;
    padding: 0;
    border-radius: var(--bubble-border-radius, var(--ha-card-border-radius, 28px));
    background-color: transparent;
    overflow: hidden;
    cursor: pointer;
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
    border: var(--bubble-border, none);
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .bpc-state-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(
      --bubble-button-background-color,
      var(--ha-card-background,
      var(--card-background-color))
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
    transition: background-color 0.4s ease, opacity 0.4s ease;
  }

  .bpc-state-overlay.is-on {
    opacity: 1;
    background-color: var(
      --bubble-accent-color,
      var(--primary-color)
    );
  }

  .bpc-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }

  .bpc-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin: 0 6px 0 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: var(
      --bubble-icon-background-color,
      var(--accent-color)
    );
  }

  .bpc-icon {
    --mdc-icon-size: 24px;
    color: var(--bubble-icon-color, var(--primary-text-color));
    opacity: 0.6;
    transition: color 0.4s ease, opacity 0.4s ease;
  }

  .bpc-icon.is-on {
    color: var(--bubble-icon-color, var(--primary-text-color));
    opacity: 1;
  }

  .bpc-name {
    flex-grow: 1;
    margin: 0 16px 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--bubble-text-color, var(--primary-text-color));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.4s ease;
    pointer-events: none;
  }

  .bpc-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--bpc-bar-height, 4px);
    background-color: color-mix(
      in srgb,
      var(--bpc-bar-color) 25%,
      transparent
    );
    pointer-events: none;
    z-index: 2;
  }

  .bpc-progress-fill {
    height: 100%;
    width: 0%;
    background-color: var(--bpc-bar-color);
    will-change: width;
  }
`;