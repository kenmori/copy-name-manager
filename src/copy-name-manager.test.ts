import { describe, it, expect, beforeEach } from "vitest";
import { CopyNameManager } from "./copy-name-manager.js";

describe("CopyNameManager", () => {
  let copyNameManager: CopyNameManager;

  beforeEach(() => {
    copyNameManager = new CopyNameManager();
  });

  it("should add a unique file name if not present", () => {
    const copyName = copyNameManager.addCopy("ファイル名");
    expect(copyName).toBe("ファイル名");
    expect(copyNameManager.getCopies()).toEqual(["ファイル名"]);
  });

  it("should return 'ファイル名のコピー' when 'ファイル名' is already present", () => {
    copyNameManager.addCopy("ファイル名");
    const copyName = copyNameManager.addCopy("ファイル名");
    expect(copyName).toBe("ファイル名のコピー");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
    ]);
  });

  it("should return 'ファイル名のコピー2' when 'ファイル名のコピー' is already present", () => {
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名");
    const copyName = copyNameManager.addCopy("ファイル名のコピー");
    expect(copyName).toBe("ファイル名のコピー2");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
    ]);
  });

  it("should return 'ファイル名のコピー3' when 'ファイル名のコピー2' is already present", () => {
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名のコピー");
    const copyName = copyNameManager.addCopy("ファイル名のコピー");
    expect(copyName).toBe("ファイル名のコピー3");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
      "ファイル名のコピー3",
    ]);
  });

  it("should reuse removed copy number", () => {
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
    ]);
    copyNameManager.addCopy("ファイル名のコピー");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
    ]);
    copyNameManager.removeCopy("ファイル名のコピー2");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
    ]);
    const copyName = copyNameManager.addCopy("ファイル名");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
    ]);
    expect(copyName).toBe("ファイル名のコピー2");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
    ]);
  });

  it("should return empty array after all copies are removed", () => {
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名");
    copyNameManager.addCopy("ファイル名のコピー");
    copyNameManager.removeCopy("ファイル名");
    copyNameManager.removeCopy("ファイル名のコピー");
    copyNameManager.removeCopy("ファイル名のコピー2");
    expect(copyNameManager.getCopies()).toEqual([]);
  });

  it("should correctly handle initial values", () => {
    const initialCopies = [
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
    ];
    copyNameManager = new CopyNameManager(initialCopies);

    const copyName1 = copyNameManager.addCopy("ファイル名");
    expect(copyName1).toBe("ファイル名のコピー3");

    const copyName2 = copyNameManager.addCopy("ファイル名のコピー");
    expect(copyName2).toBe("ファイル名のコピー4");
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
      "ファイル名のコピー3",
      "ファイル名のコピー4",
    ]);

    const copyName3 = copyNameManager.addCopy("ファイル名のコピー2");
    expect(copyName3).toBe("ファイル名のコピー5"); // ファイル名のコピー2のコピーとはならない
    expect(copyNameManager.getCopies()).toEqual([
      "ファイル名",
      "ファイル名のコピー",
      "ファイル名のコピー2",
      "ファイル名のコピー3",
      "ファイル名のコピー4",
      "ファイル名のコピー5",
    ]);
  });
});
