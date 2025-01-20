import * as vscode from "vscode";

function createBundleFileName(now: Date): string {
  const formatDatePart = (part: number) => part.toString().padStart(2, "0");

  const yyyy = now.getFullYear();
  const MM = formatDatePart(now.getMonth() + 1); // months are zero-based
  const dd = formatDatePart(now.getDate());
  const HH = formatDatePart(now.getHours());
  const mm = formatDatePart(now.getMinutes());
  const ss = formatDatePart(now.getSeconds());

  return `bundle_${yyyy}${MM}${dd}_${HH}${mm}${ss}.md`;
}

function getRelativePath(doc: vscode.TextDocument) {
  let relativePath = doc.fileName;
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    relativePath = relativePath.replace(rootPath, "");
  }
  return relativePath;
}

export async function bundleTabContents(
  allTabs: vscode.Tab[],
  progress: vscode.Progress<{ message?: string; increment?: number }>
) {
  const bundleFileName = createBundleFileName(new Date());

  let mergedContent = `# ${bundleFileName}\n`;

  const totalTabs = allTabs.length;
  let currentTab = 0;

  // Process each tab to see if it's a text file
  for (const tab of allTabs) {
    if (tab.input instanceof vscode.TabInputText) {
      // Open the TextDocument to access content
      const doc = await vscode.workspace.openTextDocument(tab.input.uri);

      // Update the progress message
      progress.report({
        message: `Bundling ${doc.fileName}... (${++currentTab}/${totalTabs})`,
      });

      // Build a relative path for the header
      appendDocumentContent(doc);
    }
  }

  return mergedContent;

  function appendDocumentContent(doc: vscode.TextDocument) {
    const relativePath = getRelativePath(doc);

    // Use doc.languageId to generate the fenced code block language
    const language = doc.languageId;

    mergedContent += `\n## ${relativePath}\n\n`;
    mergedContent += `\`\`\`${language}\n`;
    mergedContent += doc.getText();
    mergedContent += `\n\`\`\`\n`;
  }
}
