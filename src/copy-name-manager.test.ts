import { describe, it, expect, beforeEach } from "vitest";
import { CopyNameManager } from "./copy-name-manager.js";

describe("CopyNameManager", () => {
  let copyNameManager: CopyNameManager;

  beforeEach(() => {
    copyNameManager = new CopyNameManager();
  });

  it("should add a copy with the same name if it is the first copy", () => {
    const copyName = copyNameManager.addCopy("Document");
    expect(copyName).toBe("Document");
    expect(copyNameManager.getCopies()).toEqual(["Document"]);
  });

  it('should add a copy with "のコピー" when the name already exists', () => {
    copyNameManager.addCopy("Document");
    const copyName = copyNameManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
    ]);
  });

  it('should add a copy with "のコピー(2)" when "のコピー" already exists', () => {
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    const copyName = copyNameManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー(2)");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });

  it("should correctly handle removing a copy", () => {
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    const removed = copyNameManager.removeCopy("Documentのコピー");
    expect(removed).toBe(true);
    expect(copyNameManager.getCopies()).toEqual(["Document"]);
  });

  it("should not remove a copy if the name does not exist", () => {
    const removed = copyNameManager.removeCopy("NonExistentCopy");
    expect(removed).toBe(false);
  });

  it("should correctly reuse deleted copy number", () => {
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
    copyNameManager.removeCopy("Documentのコピー");
    const copyName = copyNameManager.addCopy("Document");
    expect(copyName).toBe("Documentのコピー");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー(2)",
      "Documentのコピー",
    ]);
  });

  it("should return all copies correctly", () => {
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });

  it("should return all copies even if remove origin name", () => {
    copyNameManager = new CopyNameManager(["Document", "Documentのコピー"]);
    copyNameManager.removeCopy("Document");
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    expect(copyNameManager.getCopies()).toEqual([
      "Documentのコピー",
      "Document",
      "Documentのコピー(2)",
    ]);
  });

  it("should create the same copies after deleting all and recreating", () => {
    // 最初に3つのコピーを作成
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");
    copyNameManager.addCopy("Document");

    // すべてのコピーを削除
    copyNameManager.removeCopy("Document");
    copyNameManager.removeCopy("Documentのコピー");
    copyNameManager.removeCopy("Documentのコピー(2)");

    // 再度3つのコピーを作成
    const copyName1 = copyNameManager.addCopy("Document");
    const copyName2 = copyNameManager.addCopy("Document");
    const copyName3 = copyNameManager.addCopy("Document");

    // 同じ名前になるか確認
    expect(copyName1).toBe("Document");
    expect(copyName2).toBe("Documentのコピー");
    expect(copyName3).toBe("Documentのコピー(2)");
    expect(copyNameManager.getCopies()).toEqual([
      "Document",
      "Documentのコピー",
      "Documentのコピー(2)",
    ]);
  });

  it('should default to "のコピー" if no copy suffix is provided', () => {
    const copyNameManager = new CopyNameManager();
    expect(copyNameManager.getCopySuffix()).toBe("のコピー");
  });
  it('should set the copy suffix correctly', () => {
    const copyNameManager = new CopyNameManager([], "のコピー");
    expect(copyNameManager.getCopySuffix()).toBe("のコピー");
  });
});
