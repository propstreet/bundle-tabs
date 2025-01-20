import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    files: ["**/*.ts"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginPrettier
);
