# Button Progress Card

A custom Home Assistant Lovelace card that combines a generic toggle button with an optional animated progress bar.

## Features

- Optional animated progress bar driven by a `timer.*` entity (smooth countdown via `requestAnimationFrame`)
- Optional value-based progress bar driven by numeric entities (`input_number`, `number`, `counter`, `sensor`)
- Configurable bar color, height, and direction (full→empty or empty→full)
- UI editor — no YAML required

## Installation

### HACS (recommended)

1. Open HACS → Frontend
2. Click the three-dot menu → Custom repositories
3. Add this repository URL with category `Lovelace`
4. Install **Button Progress Card**
5. Add `/hacsfiles/button-progress-card/button-progress-card.js` as a Lovelace resource

### Manual

1. Copy `dist/button-progress-card.js` to `config/www/`
2. Add `/local/button-progress-card.js` as a Lovelace resource (JavaScript module)

## Configuration

All configuration is available through the UI editor.

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | The entity to control |
| `timer_entity` | string | — | Optional progress bar entity (timer or numeric) |
| `name` | string | entity friendly name | Display name |
| `icon` | string | entity default icon | MDI icon |
| `bar_color` | string | `var(--accent-color)` | CSS color for the progress bar |
| `bar_height` | number | `4` | Bar height in pixels (1–20) |
| `reverse` | boolean | `true` | Full→empty when true, empty→full when false |
| `bar_min` | number | `0` | Min value for numeric entities without a min attribute |
| `bar_max` | number | `100` | Max value for numeric entities without a max attribute |
| `tap_action` | action | `toggle` | Single tap action |
| `hold_action` | action | `more-info` | Long press action |
| `double_tap_action` | action | `none` | Double tap action |

## Development

```bash
npm install
npm run build
npm run watch
```

After your first release, CI will commit the built `dist/` file back to the repo. Once you pull that commit, run this once to prevent local builds from dirtying your working tree:

```bash
git update-index --skip-worktree dist/button-progress-card.js
```