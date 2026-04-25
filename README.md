# CopyNameManager

`CopyNameManager` is a lightweight JavaScript/TypeScript library that helps manage unique copy names in applications. This is particularly useful when you need to create multiple copies of items with distinct names and want to ensure that each copy has a unique name, even after some copies are deleted.

## Features

- Automatically generates unique copy names in the format `name`, `nameのコピー`, `nameのコピー(2)`, etc.
- Handles deletion of copies and reuses deleted copy numbers when new copies are added.
- Supports renaming copies while preserving their position.
- Supports custom copy suffixes.
- Provides easy integration with frontend frameworks like React.

## Installation

```bash
npm install @kenmori/copy-name-manager
```

## Usage

### Basic Example

```ts
import { CopyNameManager } from "@kenmori/copy-name-manager";

const manager = new CopyNameManager();

const first = manager.addCopy("Document");
console.log(first); // "Document"

const second = manager.addCopy("Document");
console.log(second); // "Documentのコピー"

const third = manager.addCopy("Document");
console.log(third); // "Documentのコピー(2)"

manager.removeCopy("Documentのコピー");
console.log(manager.getCopies()); // ["Document", "Documentのコピー(2)"]

const reused = manager.addCopy("Document");
console.log(reused); // "Documentのコピー"
```

### Initial Names

You can pre-seed the manager with existing names:

```ts
const manager = new CopyNameManager(["Document", "Document", "Document"]);
console.log(manager.getCopies());
// ["Document", "Documentのコピー", "Documentのコピー(2)"]
```

### Custom Suffix

```ts
const manager = new CopyNameManager([], " copy");

manager.addCopy("Document");
manager.addCopy("Document");
manager.addCopy("Document");
console.log(manager.getCopies());
// ["Document", "Document copy", "Document copy(2)"]

console.log(manager.getCopySuffix()); // " copy"
```

### React Example

```tsx
import React, { useRef, useState } from "react";
import { CopyNameManager } from "@kenmori/copy-name-manager";

const CopyNameManagerComponent = () => {
  const managerRef = useRef(new CopyNameManager());
  const [copies, setCopies] = useState<string[]>([]);

  const handleAddCopy = () => {
    managerRef.current.addCopy("Document");
    setCopies([...managerRef.current.getCopies()]);
  };

  const handleRemoveCopy = (name: string) => {
    managerRef.current.removeCopy(name);
    setCopies([...managerRef.current.getCopies()]);
  };

  return (
    <div>
      <button onClick={handleAddCopy}>コピー</button>
      <ul>
        {copies.map((copy, index) => (
          <li key={index}>
            {copy} <button onClick={() => handleRemoveCopy(copy)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CopyNameManagerComponent;
```

## Visualization

<img src="https://kenjimorita.jp/wp-content/uploads/2024/11/dev.gif" alt="" width="1101" height="718" class="size-full wp-image-26085" />

- [stackblitz](https://stackblitz.com/edit/vitejs-vite-fu6pe5?embed=1&file=package.json&view=preview)

## API

### `new CopyNameManager(initialNames?, copySuffix?)`

| Parameter      | Type       | Default      | Description                                       |
| -------------- | ---------- | ------------ | ------------------------------------------------- |
| `initialNames` | `string[]` | `[]`         | Pre-existing names to initialize the manager with |
| `copySuffix`   | `string`   | `"のコピー"` | Suffix appended when generating copy names        |

### `addCopy(name: string): string`

Adds a new copy with a unique name based on the given name. Returns the generated copy name.

- First occurrence: returns `name` as-is
- Second occurrence: returns `name + copySuffix`
- Third and beyond: returns `name + copySuffix + (N)` where N starts at 2
- Deleted numbers are reused from the smallest available

### `removeCopy(name: string): boolean`

Removes the specified copy by name. Returns `true` if removed, `false` if not found. Freed numbers are available for reuse on the next `addCopy`.

### `getCopies(): string[]`

Returns an array of all current copy names in insertion order.

### `getCopySuffix(): string`

Returns the suffix string currently used when generating copy names.

### `hasCopy(name: string): boolean`

Returns `true` if the specified name exists, `false` otherwise. O(1) lookup.

### `size: number`

Returns the number of current copies.

```ts
manager.addCopy("Document");
manager.addCopy("Document");
console.log(manager.size); // 2
```

### `clear(): void`

Removes all copies and resets internal state.

```ts
manager.addCopy("Document");
manager.clear();
console.log(manager.getCopies()); // []
console.log(manager.size); // 0
```

### `renameCopy(from: string, to: string): string | false`

Renames an existing copy to a new name while preserving its position in the list. Returns the actual new name (may differ from `to` if `to` already exists), or `false` if `from` is not found.

```ts
manager.addCopy("Document");
manager.addCopy("Document");
// ["Document", "Documentのコピー"]

manager.renameCopy("Document", "Report");
console.log(manager.getCopies()); // ["Report", "Documentのコピー"]

// If the target name already exists, a suffix is appended
manager.addCopy("File");
manager.addCopy("File");
// ["File", "Fileのコピー"]
const result = manager.renameCopy("File", "Fileのコピー");
console.log(result); // "Fileのコピーのコピー"
```

## License

This project is licensed under the MIT License.
