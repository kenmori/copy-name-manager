# copy-name-manager

A versatile JavaScript/TypeScript library for managing and generating sequentially named copies with customizable naming patterns. Perfect for applications requiring dynamic duplication and renaming.

<img src="https://kenjimorita.jp/wp-content/uploads/2024/09/dev.gif" alt="A versatile JavaScript/TypeScript library for managing and generating sequentially named copies with customizable naming patterns. Perfect for applications requiring dynamic duplication and renaming." width="600px" />

## install

```
npm install corner-islands
```

[demo](https://stackblitz.com/edit/vitejs-vite-jsiwp7?embed=1&file=src%2Futils%2FCopyNameManager.ts&view=preview)

on React

```tsx
import React, { useState } from "react";
import { CopyManager } from "CopyNameManager";

const CopyManagerComponent: React.FC = () => {
  const [copyManager] = useState(new CopyManager());
  const [copies, setCopies] = useState<string[]>(copyManager.getCopies());

  const handleAddCopy = () => {
    copyManager.addCopy("fa");
    setCopies([...copyManager.getCopies()]);
  };

  const handleRemoveCopy = (name: string) => {
    copyManager.removeCopy(name);
    setCopies([...copyManager.getCopies()]);
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

export default CopyManagerComponent;
```
