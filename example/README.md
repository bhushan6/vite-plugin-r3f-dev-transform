# R3F Transform Plugin

A Vite plugin for React Three Fiber that enables scene editing capabilities. The plugin provides transform controls for meshes and automatically saves their transformations to a JSON file.

## Features

- Transform controls for meshes (translate, rotate, scale)
- Auto-saves transformations to JSON file
- Mesh selection via clicking
- Transform data persistence across refreshes
- Mesh identification using unique names

## Installation

```bash
npm install vite-plugin-r3f-transform
```

## Setup

1. Add the plugin to your Vite config:

```javascript
// vite.config.js
import r3fTransform from 'vite-plugin-r3f-transform'

export default {
  plugins: [r3fTransform()]
}
```

2. Import and use the `DevTransformWrapper` in your R3F scene:

```javascript
import { DevTransformWrapper } from 'virtual:r3f-transform'

function Scene() {
  return (
    <DevTransformWrapper>
      <mesh name="uniqueName">
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </DevTransformWrapper>
  )
}
```

## Usage

### Mesh Requirements

- Each mesh must have a unique `name` prop
- Meshes without names will be ignored
- Duplicate names will trigger a warning

```javascript
// Good
<mesh name="cube1">...</mesh>
<mesh name="cube2">...</mesh>

// Bad - Missing name
<mesh>...</mesh>

// Bad - Duplicate name
<mesh name="cube1">...</mesh>
<mesh name="cube1">...</mesh>
```

### Transform Data Storage

Transformations are automatically saved to `public/transform-data.json` in the following format:

```json
{
  "meshName1": {
    "position": [x, y, z],
    "rotation": [x, y, z],
    "scale": [x, y, z]
  },
  "meshName2": {
    "position": [x, y, z],
    "rotation": [x, y, z],
    "scale": [x, y, z]
  }
}
```

### Controls

1. Click on a mesh to select it
2. Use the transform controls to modify:
   - Position
   - Rotation
   - Scale
3. Press `Escape` to deselect the current mesh

## How It Works

1. The plugin creates a virtual module that provides the `DevTransformWrapper` component
2. When a mesh is clicked, transform controls appear
3. Changes are tracked and saved to `transform-data.json`
4. On scene load, saved transformations are applied to meshes based on their names

## Limitations

1. Relies on mesh names for identification
2. Mesh names must be unique

## Development

To modify or extend the plugin:

1. The plugin consists of two main parts:
   - Vite plugin configuration
   - DevTransformWrapper component

2. Key files:
   - `vite-plugin-r3f-transform.js`: Main plugin file
   - `transform-data.json`: Generated file storing transformations

## Future Improvements

Potential areas for enhancement:

1. UUID-based identification system
2. Multi-selection support
3. Undo/redo functionality
4. Transform snapping
5. Custom keyboard shortcuts
6. Support for grouped transformations
7. Transform history
8. Export/import capabilities

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License