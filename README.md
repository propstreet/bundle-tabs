# bundle-tabs

Bundle the content of all your open editor tabs into one neatly formatted Markdown file, perfect for sharing, copying, or feeding into your favorite LLM!  

## Features

- **Merge Tabs**: Collect all open text tabs, format them in a single Markdown document with code blocks for each file's language mode.  
- **Clean Output**: Each file's content is labeled with a relative path and wrapped in markdown fences (e.g., ```typescript ...```).  
- **LLM-friendly**: Perfect for copying directly into GPT or other AI tools.

**Example**  

If you have three open files:  

- `/src/foo.ts`
- `/src/bar.js`
- `/README.md`

Running the "Bundle Open Tabs" command creates a new unsaved Markdown file with sections like:

```md
## /src/foo.ts

// foo.ts content

## /src/bar.js

// bar.js content

## /README.md

// README.md content
```

## Requirements

No special configuration needed—just open a folder in VS Code, open a few files, and run the **"Bundle Open Tabs"** command. You can:

1. Open the command palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Bundle Open Tabs" and select the command
3. A new markdown file will be created with the bundled content

## Extension Settings

Currently, no additional settings are exposed. This extension aims to be lightweight.

## Known Issues

- When running automated tests or using in headless environments, ensure that you have a valid display or use `xvfb` on Linux.  
- In multi-root workspaces, the first root folder is used to derive relative paths; future updates may include more sophisticated path handling.

## Release Notes

### 1.0.1

- Added compatibility for Cursor (v0.44.11)

### 1.0.0

- Initial release with basic functionality: merges open tabs into a new Markdown document.

---

## Contributing

Feel free to submit PRs or issues on [GitHub](https://github.com/propstreet/bundle-tabs). Contributions are welcome to enhance features, improve stability, or extend multi-root workspace support!

---

**Enjoy!**  
Happy bundling!
