class CopyNameManager {
  private copyNumbers: Record<string, Set<number>>;
  private copies: string[];

  constructor(initialNames: string[] = []) {
    this.copyNumbers = {};
    this.copies = [];

    initialNames.forEach((name) => {
      this.addCopy(name);
    });
  }

  addCopy(name: string): string {
    if (!this.copyNumbers[name]) {
      this.copyNumbers[name] = new Set<number>();
    }

    let newCopyName: string;

    if (this.copies.includes(name)) {
      // 名前が既に存在する場合、「のコピー」形式で新しいコピー名を作成
      if (!this.copyNumbers[name]?.has(1)) {
        newCopyName = `${name}のコピー`;
        this.copyNumbers[name]?.add(1); // 最初のコピーを予約
      } else {
        // 「のコピー」が存在する場合、次の番号付きコピーを作成
        let nextCopyNumber = 2; // (2) からスタート
        while (this.copyNumbers[name]?.has(nextCopyNumber)) {
          nextCopyNumber++;
        }
        newCopyName = `${name}のコピー(${nextCopyNumber})`;
        this.copyNumbers[name]?.add(nextCopyNumber);
      }
    } else {
      // 名前がまだ使われていない場合、そのままの名前を使用
      newCopyName = name;
    }

    // 新しいコピー名が既存のコピーと競合していないか確認
    // Check if the new copy name conflicts with existing copies
    let copyNumber = 1;
    while (this.copies.includes(newCopyName)) {
      copyNumber++;
      newCopyName = `${name}のコピー(${copyNumber})`;
    }

    this.copies.push(newCopyName);
    return newCopyName;
  }

  removeCopy(name: string): boolean {
    const index = this.copies.findIndex((copy) => copy === name);
    if (index > -1) {
      const [removedCopy] = this.copies.splice(index, 1);

      if (!removedCopy) {
        throw new Error("removedCopy is empty");
      }

      const baseName = removedCopy
        .replace(/のコピー\(\d+\)$/, "")
        .replace(/のコピー$/, "");
      const match = removedCopy.match(/のコピー\((\d+)\)$/);
      const copyNumber = match ? parseInt(match[1] || "", 10) : 1;

      if (this.copyNumbers[baseName]) {
        this.copyNumbers[baseName]?.delete(copyNumber);
      }

      return true;
    }
    return false;
  }

  getCopies(): string[] {
    return this.copies;
  }
}

export { CopyNameManager };
