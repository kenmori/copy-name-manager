class CopyManager {
  private copyNumbers: Record<string, Set<number>>;
  private copies: string[];

  constructor() {
    this.copyNumbers = {};
    this.copies = [];
  }

  addCopy(name: string): string {
    if (!this.copyNumbers[name]) {
      this.copyNumbers[name] = new Set<number>();
    }

    let newCopyName: string;

    if (this.copies.includes(name)) {
      // 名前が既に存在する場合、「のコピー」形式で新しいコピー名を作成
      let nextCopyNumber = 0;
      while (this.copyNumbers[name]?.has(nextCopyNumber)) {
        nextCopyNumber++;
      }

      newCopyName = `${name}のコピー${
        nextCopyNumber > 1 ? nextCopyNumber : ""
      }`;
      this.copyNumbers[name]?.add(nextCopyNumber);
    } else {
      // 名前がまだ使われていない場合、そのままの名前を使用
      newCopyName = name;
      this.copyNumbers[name]?.add(1); // 次に「のコピー」が作成されるように予約
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
      const baseName = removedCopy.replace(/のコピー[0-9]*$/, "");
      const copyNumber =
        parseInt(removedCopy.replace(`${baseName}のコピー`, "")) || 1;

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

export { CopyManager };
