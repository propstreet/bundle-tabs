import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Register the command
  const disposable = vscode.commands.registerCommand(
    "extension.bundle-tabs",
    async () => {
      try {
        // Get all tabs across all tab groups
        const allTabs = vscode.window.tabGroups.all.flatMap(
          (group) => group.tabs
        );

        // We'll build a big string here, start with current day and time
        let mergedContent = `# ${new Date().toLocaleString()}\n`;

        // Process each tab to see if it's a text file
        for (const tab of allTabs) {
          if (tab.input instanceof vscode.TabInputText) {
            // Open the TextDocument to access content
            const doc = await vscode.workspace.openTextDocument(tab.input.uri);

            // Build a relative path for the header
            let relativePath = doc.fileName;
            if (
              vscode.workspace.workspaceFolders &&
              vscode.workspace.workspaceFolders.length > 0
            ) {
              const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
              relativePath = relativePath.replace(rootPath, "");
            }

            // Use doc.languageId to generate the fenced code block language
            const language = doc.languageId;

            mergedContent += `\n## ${relativePath}\n\n`;
            mergedContent += `\`\`\`${language}\n`;
            mergedContent += doc.getText();
            mergedContent += `\n\`\`\`\n`;
          }
        }

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
