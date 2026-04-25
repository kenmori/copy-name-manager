class CopyNameManager {
  private copyNumbers: Record<string, Set<number>>;
  private copies: string[];
  private copiesSet: Set<string>;
  private copySuffix: string;
  private escapedSuffix: string;

  constructor(initialNames: string[] = [], copySuffix = "のコピー") {
    this.copyNumbers = {};
    this.copies = [];
    this.copiesSet = new Set();
    this.copySuffix = copySuffix;
    this.escapedSuffix = this.escapeRegExp(copySuffix);

    initialNames.forEach((name) => {
      this.addCopy(name);
    });
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
  }

  private generateUniqueName(name: string): string {
    const baseName = name.replace(
      new RegExp(`${this.escapedSuffix}(\\d*)$`),
      "",
    );
    if (!this.copyNumbers[baseName]) {
      this.copyNumbers[baseName] = new Set<number>();
    }

    let newCopyName: string;

    if (this.copiesSet.has(name)) {
      if (!this.copyNumbers[name]?.has(1)) {
        newCopyName = `${name}${this.copySuffix}`;
        this.copyNumbers[name]?.add(1);
      } else {
        let nextCopyNumber = 2;
        while (this.copyNumbers[name]?.has(nextCopyNumber)) {
          nextCopyNumber++;
        }
        newCopyName = `${name}${this.copySuffix}(${nextCopyNumber})`;
        this.copyNumbers[name]?.add(nextCopyNumber);
      }
    } else {
      newCopyName = name;
    }

    let copyNumber = 1;
    while (this.copiesSet.has(newCopyName)) {
      copyNumber++;
      newCopyName = `${name}${this.copySuffix}(${copyNumber})`;
    }

    return newCopyName;
  }

  private untrackCopy(name: string): void {
    const baseName = name
      .replace(new RegExp(`${this.escapedSuffix}\\(\\d+\\)$`), "")
      .replace(new RegExp(`${this.escapedSuffix}$`), "");

    if (name === baseName) return;

    const match = name.match(new RegExp(`${this.escapedSuffix}\\((\\d+)\\)$`));
    const copyNumber = match ? parseInt(match[1] || "", 10) : 1;

    this.copyNumbers[baseName]?.delete(copyNumber);
  }

  addCopy(name: string): string {
    const newCopyName = this.generateUniqueName(name);
    this.copies.push(newCopyName);
    this.copiesSet.add(newCopyName);
    return newCopyName;
  }

  removeCopy(name: string): boolean {
    const index = this.copies.indexOf(name);
    if (index === -1) return false;

    this.copies.splice(index, 1);
    this.copiesSet.delete(name);
    this.untrackCopy(name);

    return true;
  }

  renameCopy(from: string, to: string): string | false {
    const index = this.copies.indexOf(from);
    if (index === -1) return false;

    this.copiesSet.delete(from);
    this.untrackCopy(from);

    const newName = this.generateUniqueName(to);

    this.copies[index] = newName;
    this.copiesSet.add(newName);

    return newName;
  }

  getCopies(): string[] {
    return [...this.copies];
  }

  getCopySuffix(): string {
    return this.copySuffix;
  }

  hasCopy(name: string): boolean {
    return this.copiesSet.has(name);
  }

  get size(): number {
    return this.copies.length;
  }

  clear(): void {
    this.copies = [];
    this.copiesSet = new Set();
    this.copyNumbers = {};
  }
}

export { CopyNameManager };
