import * as vscode from "vscode";
import { bundleTabContents } from "./bundler";

export function activate(context: vscode.ExtensionContext) {
  // Register the command
  const disposable = vscode.commands.registerCommand(
    "propstreet.bundle-tabs",
    async () => {
      try {
        // Get all tabs across all tab groups
        const allTabs = vscode.window.tabGroups.all.flatMap(
          (group) => group.tabs
        );

        const mergedContent = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Bundling open tabs...",
            cancellable: false,
          },
          async (progress) => {
            return await bundleTabContents(allTabs, progress);
          });

        // Open the merged content in a new, unsaved document
        const newDoc = await vscode.workspace.openTextDocument({
          content: mergedContent,
          language: "markdown",
        });
        
        await vscode.window.showTextDocument(newDoc, { preview: false });
      } catch (err) {
        vscode.window.showErrorMessage(`Error merging files: ${err}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Clean up if needed
}
