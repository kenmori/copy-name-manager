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
  it("should set the copy suffix correctly", () => {
    const copyNameManager = new CopyNameManager([], "のコピー");
    expect(copyNameManager.getCopySuffix()).toBe("のコピー");
  });

  describe("カスタムサフィックス", () => {
    it("カスタムサフィックスで最初のコピー名を生成できる", () => {
      const manager = new CopyNameManager([], " copy");
      manager.addCopy("Document");
      const copyName = manager.addCopy("Document");
      expect(copyName).toBe("Document copy");
      expect(manager.getCopies()).toEqual(["Document", "Document copy"]);
    });

    it("カスタムサフィックスで(2)以降のコピーを生成できる", () => {
      const manager = new CopyNameManager([], " copy");
      manager.addCopy("Document");
      manager.addCopy("Document");
      const copyName = manager.addCopy("Document");
      expect(copyName).toBe("Document copy(2)");
    });

    it("カスタムサフィックスのコピーを削除して再追加できる", () => {
      const manager = new CopyNameManager([], " copy");
      manager.addCopy("Document");
      manager.addCopy("Document");
      manager.removeCopy("Document copy");
      const copyName = manager.addCopy("Document");
      expect(copyName).toBe("Document copy");
    });
  });

  describe("複数の異なるベース名", () => {
    it("異なるベース名のコピーが独立して管理される", () => {
      copyNameManager.addCopy("Document");
      copyNameManager.addCopy("Image");
      copyNameManager.addCopy("Document");
      copyNameManager.addCopy("Image");
      expect(copyNameManager.getCopies()).toEqual([
        "Document",
        "Image",
        "Documentのコピー",
        "Imageのコピー",
      ]);
    });

    it("一方の名前を削除しても他方のコピーには影響しない", () => {
      copyNameManager.addCopy("Document");
      copyNameManager.addCopy("Image");
      copyNameManager.addCopy("Document");
      copyNameManager.removeCopy("Document");
      const newCopy = copyNameManager.addCopy("Document");
      expect(newCopy).toBe("Document");
      expect(copyNameManager.getCopies()).toContain("Image");
    });

    it("前方一致する異なる名前が独立して管理される", () => {
      copyNameManager.addCopy("Doc");
      copyNameManager.addCopy("Document");
      copyNameManager.addCopy("Doc");
      copyNameManager.addCopy("Document");
      expect(copyNameManager.getCopies()).toEqual([
        "Doc",
        "Document",
        "Docのコピー",
        "Documentのコピー",
      ]);
    });
  });

  describe("多数のコピー", () => {
    it("5つのコピーを順番に生成できる", () => {
      for (let i = 0; i < 5; i++) copyNameManager.addCopy("Document");
      expect(copyNameManager.getCopies()).toEqual([
        "Document",
        "Documentのコピー",
        "Documentのコピー(2)",
        "Documentのコピー(3)",
        "Documentのコピー(4)",
      ]);
    });

    it("(2)を削除後に追加すると(2)が再利用される", () => {
      for (let i = 0; i < 4; i++) copyNameManager.addCopy("Document");
      copyNameManager.removeCopy("Documentのコピー(2)");
      const copyName = copyNameManager.addCopy("Document");
      expect(copyName).toBe("Documentのコピー(2)");
    });

    it("中間の複数コピーを削除後に最小の欠番から再利用される", () => {
      for (let i = 0; i < 5; i++) copyNameManager.addCopy("Document");
      copyNameManager.removeCopy("Documentのコピー(2)");
      copyNameManager.removeCopy("Documentのコピー(3)");
      const copyName = copyNameManager.addCopy("Document");
      expect(copyName).toBe("Documentのコピー(2)");
    });
  });

  describe("コンストラクタ初期値", () => {
    it("初期値に同一名を複数渡すと連番コピーが生成される", () => {
      const manager = new CopyNameManager(["File", "File", "File"]);
      expect(manager.getCopies()).toEqual([
        "File",
        "Fileのコピー",
        "Fileのコピー(2)",
      ]);
    });

    it("初期値から続けてコピーを追加できる", () => {
      const manager = new CopyNameManager(["File", "File"]);
      const copyName = manager.addCopy("File");
      expect(copyName).toBe("Fileのコピー(2)");
    });

    it("初期値からコピーを削除して再追加できる", () => {
      const manager = new CopyNameManager(["File", "File", "File"]);
      manager.removeCopy("Fileのコピー");
      const copyName = manager.addCopy("File");
      expect(copyName).toBe("Fileのコピー");
    });
  });

  describe("エッジケース", () => {
    it("サフィックスを含む名前をそのまま追加できる", () => {
      const copyName = copyNameManager.addCopy("Documentのコピー");
      expect(copyName).toBe("Documentのコピー");
      expect(copyNameManager.getCopies()).toEqual(["Documentのコピー"]);
    });

    it("サフィックスを含む名前が既に存在する場合にさらにサフィックスを付与する", () => {
      copyNameManager.addCopy("Documentのコピー");
      const copyName = copyNameManager.addCopy("Documentのコピー");
      expect(copyName).toBe("Documentのコピーのコピー");
    });

    it("数字を含む名前を正しく処理できる", () => {
      copyNameManager.addCopy("File2");
      const copyName = copyNameManager.addCopy("File2");
      expect(copyName).toBe("File2のコピー");
      expect(copyNameManager.getCopies()).toEqual(["File2", "File2のコピー"]);
    });

    it("スペースを含む名前を正しく処理できる", () => {
      copyNameManager.addCopy("My Document");
      const copyName = copyNameManager.addCopy("My Document");
      expect(copyName).toBe("My Documentのコピー");
    });

    it("addCopyの戻り値とgetCopiesの末尾が一致する", () => {
      copyNameManager.addCopy("Document");
      copyNameManager.addCopy("Document");
      const copyName = copyNameManager.addCopy("Document");
      const copies = copyNameManager.getCopies();
      expect(copies[copies.length - 1]).toBe(copyName);
    });
  });
});
