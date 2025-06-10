import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: { js },
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'never'],
      indent: ['error', 2],
      quotes: ['error', 'single']
    }
  },
  {
    files: ['**/*.vue'],
    ...pluginVue.configs['flat/essential'],
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 2 },
          multiline: { max: 1 }
        }
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true
        }
      ]
    }
  }
])
