class CopyNameManager {
  private copyNumbers: { [key: string]: Set<number> };
  private copies: string[];
  private copySuffix: string;

  constructor(initialNames?: string[], copySuffix = "のコピー") {
    this.copyNumbers = {};
    this.copies = [];
    this.copySuffix = copySuffix;

    initialNames?.forEach((name) => {
      this.addCopy(name);
    });
  }
  private escapeRegExp(string: string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  addCopy(name: string): string {
    const escapedSuffix = this.escapeRegExp(this.copySuffix);
    const baseName = name.replace(new RegExp(`${escapedSuffix}(\\d*)$`), "");
    if (!this.copyNumbers[baseName]) {
      this.copyNumbers[baseName] = new Set<number>();
    }

    let newCopyName: string;

    // Check if the ‘filename’ already exists.
    if (this.copies.includes(name)) {
      // 使用可能な番号を探す
      let copyNumber = this.findAvailableCopyNumber(baseName, 1);
      newCopyName = `${baseName}${this.copySuffix}${copyNumber > 1 ? copyNumber : ""}`;

      // Check if the new copy name already exists
      while (this.copies.includes(newCopyName)) {
        copyNumber = this.findAvailableCopyNumber(baseName, copyNumber + 1);
        newCopyName = `${baseName}${this.copySuffix}${copyNumber > 1 ? copyNumber : ""}`;
      }

      this.copyNumbers[baseName]?.add(copyNumber);
    } else {
      // If this is your first copy, use the name as it is.
      newCopyName = name;
    }

    this.copies.push(newCopyName);
    return newCopyName;
  }

  // Find recursively available copy numbers.
  private findAvailableCopyNumber(
    baseName: string,
    copyNumber: number,
  ): number {
    if (!this.copyNumbers[baseName]?.has(copyNumber)) {
      return copyNumber;
    } else {
      return this.findAvailableCopyNumber(baseName, copyNumber + 1);
    }
  }

  removeCopy(name: string): void {
    const index = this.copies.indexOf(name);
    if (index > -1) {
      this.copies.splice(index, 1);
      const escapedSuffix = this.escapeRegExp(this.copySuffix);
      const regex = new RegExp(`${escapedSuffix}(\\d*)$`);
      const baseName = name.replace(regex, "");
      const match = name.match(regex);
      if (match) {
        const copyNumber = parseInt(match[1] || "", 10);
        this.copyNumbers[baseName]?.delete(copyNumber);
      }
    }
  }

  getCopies(): string[] {
    return this.copies;
  }
}

export { CopyNameManager };
