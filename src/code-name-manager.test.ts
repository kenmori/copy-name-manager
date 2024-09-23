import { describe, it, expect, beforeEach } from "vitest";
import { CopyManager } from "./code-name-manager.js";

describe("CopyManager", () => {
  let copyManager: CopyManager;

  beforeEach(() => {
    copyManager = new CopyManager();
  });

  it("should add a copy with the same name if it is the first copy", () => {
    const copyName = copyManager.addCopy("Document");
    expect(copyName).toBe("Document");
    expect(copyManager.getCopies()).toEqual(["Document"]);
  });

  it('should add a copy with "のコピー" when the name already exists', () => {
    copyManager.addCopy("Document");
    const copyName = copyManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー");
    expect(copyManager.getCopies()).toEqual(["Document", "Documentのコピー"]);
  });

  it('should add a copy with "のコピー(2)" when "のコピー" already exists', () => {
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    const copyName = copyManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー(2)");
    expect(copyManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });

  it("should correctly handle removing a copy", () => {
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    const removed = copyManager.removeCopy("Documentのコピー");
    expect(removed).toBe(true);
    expect(copyManager.getCopies()).toEqual(["Document"]);
  });

  it("should not remove a copy if the name does not exist", () => {
    const removed = copyManager.removeCopy("NonExistentCopy");
    expect(removed).toBe(false);
  });

  it("should correctly reuse deleted copy number", () => {
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    copyManager.removeCopy("Documentのコピー");
    const copyName = copyManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー");
    expect(copyManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー(2)",
      "Documentのコピー",
    ]);
  });

  it("should return all copies correctly", () => {
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    expect(copyManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });

  it("should create the same copies after deleting all and recreating", () => {
    // 最初に3つのコピーを作成
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");
    copyManager.addCopy("Document");

    // すべてのコピーを削除
    copyManager.removeCopy("Document");
    copyManager.removeCopy("Documentのコピー");
    copyManager.removeCopy("Documentのコピー(2)");

    // 再度3つのコピーを作成
    const copyName1 = copyManager.addCopy("Document");
    const copyName2 = copyManager.addCopy("Document");
    const copyName3 = copyManager.addCopy("Document");

    // 同じ名前になるか確認
    expect(copyName1).toBe("Document");
    expect(copyName2).toBe("Documentのコピー");
    expect(copyName3).toBe("Documentのコピー(2)");
    expect(copyManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });
});
