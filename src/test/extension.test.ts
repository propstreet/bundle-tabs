import * as assert from "assert";
import * as vscode from "vscode";
// Replace this import path with wherever your activate/deactivate is defined, if needed.
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be loaded", async () => {
    // Replace 'yourPublisherName.yourExtensionId' with actual values from package.json
    const extension = vscode.extensions.getExtension("propstreet.bundle-tabs");
    assert.ok(extension, "Extension should be present");

    // Await extension activation
    await extension?.activate();
    assert.strictEqual(
      extension?.isActive,
      true,
      "Extension should be active after activation"
    );
  });

  test("bundle-tabs command should bundle two files", async () => {
    const doc1 = await vscode.workspace.openTextDocument({
      content: "doc1",
    });
    await vscode.window.showTextDocument(doc1);
    const doc2 = await vscode.workspace.openTextDocument({
      content: "doc2",
    });
    await vscode.window.showTextDocument(doc2);

    // get all open tabs
    let openTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);
    assert.strictEqual(
      openTabs.length,
      2,
      "Expecting at least two tabs to be open after opening two documents"
    );

    // run the command
    await vscode.commands.executeCommand("propstreet.bundle-tabs");

    // refresh the open tabs
    openTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);
    assert.strictEqual(
      openTabs.length,
      3,
      "Expecting at one new tab after bundling"
    );

    // get the contents of the active tab
    const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;

    // ensure the active tab is a markdown file
    assert.strictEqual(
      activeTab?.input instanceof vscode.TabInputText,
      true,
      "Expecting the active tab to be a markdown file"
    );

    // get the text of the active tab
    const tabInput = activeTab?.input as vscode.TabInputText;
    const bundledDoc = await vscode.workspace.openTextDocument(tabInput.uri);
    const bundledText = bundledDoc.getText();
    assert.ok(
      bundledText.startsWith("#"),
      "Merged doc should start with a markdown header"
    );
    assert.ok(
      bundledText.includes("doc1"),
      "Merged doc should include content from doc1"
    );
    assert.ok(
      bundledText.includes("doc2"),
      "Merged doc should include content from doc2"
    );
  });
});
