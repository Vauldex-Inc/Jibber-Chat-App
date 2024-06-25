import pluginVue from "eslint-plugin-vue";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    ignores: ["vars/env.json"],
    files: ['**/*.js', '**/*.vue', '**/*.ts'],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "import/no-named-as-default-member": "off",
      "vue/no-v-html": "off"
    }
  }
]