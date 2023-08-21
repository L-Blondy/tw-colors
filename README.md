# Welcome to [tw-colors](https://github.com/L-Blondy/tw-colors)

Introducing the ultimate game-changer for your Tailwind app! Say goodbye to cluttered dark variants and messy CSS variables. With this tailwind plugin, switching between color themes is as effortless as changing one className.

## Highlights

* 🚀 **No markup change required**,  no need to refactor your existing code.
* 📦 **Zero javascript** added to the bundle size, it's just some CSS!
* ✨ **All color formats** are supported, including HEX, RGB, HSL, and named colors
* 🤩 **Fine-grained theming** with variants
* 💫 **Full [Tailwind CSS Intellisense][tailwind-intellisense-url] support** 🔥🔥🔥
 

## The Gist

```bash
npm i -D tw-colors
```

Take an existing tailwind config and move the colors in the `createTheme` plugin, giving it a name (e.g. light).

*tailwind.config.js*
```diff
+  const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      theme: {
         extends: {
-           colors: {
-              'primary': 'steelblue',
-              'secondary': 'darkblue',
-              'brand': '#F3F3F3',
-           }
         },
      },
      plugins: [
+        createThemes({
+           light: { 
+              'primary': 'steelblue',
+              'secondary': 'darkblue',
+              'brand': '#F3F3F3',
+           }
+        })
      ],
   };

```

Apply the `theme-light` class anywhere in your app. \
Alternatively you can use data attributes `data-theme="light"`

```diff
-  <html>
+  <html class='theme-light'>
      ...
      <div class='bg-brand'>
         <h1 class='text-primary'>...</h1>
         <p class='text-secondary'>...</p>
      </div>
      ...
   </html>
```

That's it, you site has a light theme!

## Usage

### Add multiple themes

Inside the `createThemes` function, define multiple color themes that use the same color names.

*tailwind.config.js*
```diff
   const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      plugins: [
         createThemes({
            light: { 
               'primary': 'steelblue',
               'secondary': 'darkblue',
               'brand': '#F3F3F3',
            },
+           dark: { 
+              'primary': 'turquoise',
+              'secondary': 'tomato',
+              'brand': '#4A4A4A',
+           },
+           forest: { 
+              'primary': '#2A9D8F',
+              'secondary': '#E9C46A',
+              'brand': '#264653',
+           },
         })
      ],
   };
```

### Switching themes

Simply switch the className.

```diff
-  <html class='theme-light'>
+  <html class='theme-dark'>
      ...
   </html>
```

...or the *data-theme* attribute

```diff
-  <html data-theme='light'>
+  <html data-theme='dark'>
      ...
   </html>
```

## Advanced usage

### Nested themes

```diff
   <html class='theme-dark'>
      ...
      <div class='theme-light'>
         ...
      </div>

      <div class='theme-forest'>
         ...
      </div>
   </html>
```

###  Variants

Based on the current themes, specific styles can be applied with variants

```html
   <!-- Use "serif" font for the dark theme, "sans" font for all other themes -->

   <div class='theme-dark font-sans theme-dark:font-serif'>
      ...
      <div>Serif font here</div>
   </div>

   <div class='theme-light font-sans theme-dark:font-serif'>
      ...
      <div>Sans font here</div>
   </div>
```

Variants only work alongside theme declarations

❌ Does not work

```html
   <html class='theme-dark font-sans'>
      ...
      <div class='theme-dark:font-serif'>
         ❌ Sans font here
      </div>
   </html>
```


✅ Works fine

```html
   <html class='theme-dark font-sans theme-dark:font-serif'>
      ...
      <div>
         ✅ Serif font here
      </div>
   </html>
```

*Note: this feature might be added in future versions based on community feedback*

<details>
   <summary>
         <strong> Caveats: inherited properties </strong>
   </summary>

   Inherited properties (e.g. "font-family") are inherited by **all descendants**, including nested themes.
   In order to stop the propagation the base styles should be re-declared on nested themes

   ❌ Unexpected behavior

   ```html
      <html class='theme-dark font-sans theme-dark:font-serif'>
         ...
         <div>
            ✅ Serif is active
         </div>

         <div class="theme-light">
            ❌ Serif is still active, it got inherited from the parent theme
         </div>     
      </html>
   ```

   ✅ Works as expected

   ```html
      <html class='theme-dark font-sans theme-dark:font-serif'>
         ...
         <div>
            ✅ Serif is active
         </div>

         <div class="theme-light font-sans theme-dark:font-serif">
            ✅ Sans is active
         </div>   
      </html>
   ```
</details>

### CSS color-scheme

`createThemes` also accepts a function that exposes the `light` and `dark` functions. \
To apply the `color-scheme` CSS property, simply wrap your themes with `light` or `dark`."

*tailwind.config.js*
```js
   const { createThemes } = require('tw-colors');

   module.exports = {
      // ...your tailwind config
      plugins: [
         createThemes(({ light, dark }) => ({
            'my-light-theme': light({ 
               'primary': 'steelblue',
               'secondary': 'darkblue',
               'brand': '#F3F3F3',
            }),
            'my-dark-theme': dark({ 
               'primary': 'turquoise',
               'secondary': 'tomato',
               'brand': '#4A4A4A',
            }),
         }))
      ],
   };
```

See the [MDN docs][mdn-color-scheme] for more details on this feature.

### CSS Variables

**tw-colors** creates CSS variables using the format `--twc-[color name]` by default, they contain HSL values. 

For example, with the following configuration, the variables `--twc-primary`, `--twc-secondary`, `--twc-brand` will be created.

*tailwind.config.js*
```js
   module.exports = {
      // ...your tailwind config
      plugins: [
         createThemes({
            'my-light-theme': { 
               'primary': 'steelblue',
               'secondary': 'darkblue',
               'brand': '#F3F3F3',
            },
            'my-dark-theme': { 
               'primary': 'turquoise',
               'secondary': 'tomato',
               'brand': '#4A4A4A',
            },
         })
      ],
   };
```

Example usage:

```css 
.my-class {
   color: hsl(var(--twc-primary));
   background: hsl(var(--twc-primary) / 0.5);
}
```

## Options

Some options can be passed as the second argument to the plugin

```js
createThemes({
   // your colors config goes here 
}, {
   defaultTheme: 'light',
   getCssVariable: (colorName) => `--twc-${colorName}`,
   getThemeClassName: (themeName) => `theme-${themeName}`,
})
```

### <samp>defaultTheme</samp>

The default theme to use, think of it as a fallback theme.

**Example** 
```js
createThemes({
   'light': { 
      'primary': 'steelblue',
   },
   'dark': { 
      'primary': 'turquoise',
   },
}, {
   defaultTheme: 'light' // 'light' | 'dark'
})
```

### <samp>getCssVariable</samp>

**default**: <code>(colorName) => \`--twc-${colorName}\`</code>

Lets you customize the css variables generated by the plugin.

With the below configuration, the following variables will be created:
* `--a-primary-z` (ex *twc-primary*)
* `--a-secondary-z` (ex *twc-secondary*)
* `--a-brand-z` (ex *twc-brand*)

```js
createThemes({
   'light': { 
      'primary': 'steelblue',
      'secondary': 'darkblue',
      'brand': '#F3F3F3',
   },
   'dark': { 
      'primary': 'turquoise',
      'secondary': 'tomato',
      'brand': '#4A4A4A',
   },
}, {
   getCssVariable: (colorName) => `--a-${colorName}-z`
})
```

### <samp>getThemeClassName</samp>

**default**: <code>(themeName) => \`theme-${themeName}\`</code>

Lets you customize the classNames for the themes and variants

With the below configuration, the following theme classNames and variants will be created: 
* `branding-light` (ex *theme-light*)
* `branding-dark` (ex *theme-dark*)


```js
createThemes({
   'light': { 
      'primary': 'steelblue',
      'secondary': 'darkblue',
      'brand': '#F3F3F3',
   },
   'dark': { 
      'primary': 'turquoise',
      'secondary': 'tomato',
      'brand': '#4A4A4A',
   },
}, {
   getThemeClassName: (themeName) => `branding-${themeName}`
})
```

<div align="center">

Please share

[![][tweet]][tweet-url]

</div >

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsaadeghi%2Fdaisyui
[tweet-url]: https://twitter.com/intent/tweet?text=tw-colors%0ATailwind%20color%20themes%20made%20easy!%0Ahttps://github.com/L-Blondy/tw-colors
[tailwind-intellisense-url]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
[mdn-color-scheme]: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
<!-- https://github.com/L-Blondy/tw-colors/blob/master/README.md -->
