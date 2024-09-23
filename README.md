# CopyNameManager

`CopyNameManager` is a lightweight JavaScript/TypeScript library that helps manage unique copy names in applications. This is particularly useful when you need to create multiple copies of items with distinct names and want to ensure that each copy has a unique name, even after some copies are deleted.

## Features

- Automatically generates unique copy names in the format `name`, `nameのコピー`, `nameのコピー2`, etc.
- Handles deletion of copies and reuses deleted copy numbers when new copies are added.
- Provides easy integration with frontend frameworks like React.

## Installation

You can install the library via npm:

```bash
npm install copy-name-manager
```

## Usage

### Basic Example

Here is how you can use CopyNameManager in a JavaScript/TypeScript project:

```ts
import { CopyNameManager } from "copy-name-manager";

const copyNameManager = new CopyNameManager();

const firstCopy = copyNameManager.addCopy("Document");
console.log(firstCopy); // Output: "Document"

const secondCopy = copyNameManager.addCopy("Document");
console.log(secondCopy); // Output: "Documentのコピー"

const thirdCopy = copyNameManager.addCopy("Document");
console.log(thirdCopy); // Output: "Documentのコピー2"

// Removing a copy
copyNameManager.removeCopy("Documentのコピー");
console.log(copyNameManager.getCopies()); // Output: ["Document", "Documentのコピー2"]

// Adding a new copy after deletion
const newCopy = copyNameManager.addCopy("Document");
console.log(newCopy); // Output: "Documentのコピー"
```

### React Example

CopyNameManager can be easily integrated into React applications. Below is an example of how to use it:

```tsx
import React, { useState } from "react";
import { CopyNameManager } from "copy-name-manager";

const CopyNameManagerComponent = () => {
  const copyNameManager = new CopyNameManager();
  const [copies, setCopies] = useState<string[]>([]);

  const handleAddCopy = () => {
    const newCopy = copyNameManager.addCopy("Document");
    setCopies([...copyNameManager.getCopies()]);
  };

  const handleRemoveCopy = (name: string) => {
    copyNameManager.removeCopy(name);
    setCopies([...copyNameManager.getCopies()]);
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

To better understand how CopyNameManager works, here's a visual example:

<img src="https://kenjimorita.jp/wp-content/uploads/2024/09/dev-1.gif" alt="npm library 'copy-name-manager'" class="size-large wp-image-25961" />

- [stackblitz](https://stackblitz.com/edit/vitejs-vite-jsiwp7?embed=1&file=README.md&view=preview)

## API

`addCopy(name: string): string`

Adds a new copy with a unique name based on the given name. Returns the generated copy name.

`removeCopy(name: string): boolean`

Removes the specified copy. Returns true if the copy was successfully removed, otherwise returns false.

`getCopies(): string[]`

Returns an array of all the current copies.

## License

This project is licensed under the MIT License.
