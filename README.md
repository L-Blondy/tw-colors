# Welcome to [tw-colors](https://github.com/L-Blondy/tw-colors)

Introducing the ultimate game-changer for your Tailwind app! Say goodbye to cluttered dark variants and messy CSS variables. With this tailwind plugin, switching between color themes is as effortless as changing one className.

## Highlights

* 📦 **Zero javascript** added to the bundle size, it's just some CSS!
* 🚀 **Fully customizable**, tailor it to your needs
* 🎯 **Fine-grained theming** with variants
* 🤩 **Nested themes** for complex layouts
* ✨ **All color formats are supported**, including HEX, RGB, HSL, and named colors
* 💫 **Full [Tailwind CSS Intellisense][tailwind-intellisense-url] support** 🔥🔥🔥

## Changelog

See the full [changelog here](https://github.com/L-Blondy/tw-colors/blob/master/CHANGELOG.md) 

## Usage

```bash
npm i -D tw-colors
```

Take an existing tailwind config and move the colors in the `createThemes` plugin, giving it a name (e.g. light).

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

Apply `class='light'` or `data-theme='light'` anywhere in your app. 

*See the [options](https://github.com/L-Blondy/tw-colors/tree/master#producethemeclass) to customize the className*

```diff
-  <html>
+  <html class='light'>
      ...
      <div class='bg-brand'>
         <h1 class='text-primary'>...</h1>
         <p class='text-secondary'>...</p>
      </div>
      ...
   </html>
```

That's it, you site has a light theme!

### Adding more themes

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

You now have a **light**, a **dark** and a **forest** theme!

### Switching themes

Simply switch the *class* or the *data-theme* attribute

```diff
-  <html class='light'>
+  <html class='dark'>
      ...
   </html>
```

### Nested themes

#### With <samp>data-theme</samp>

Just nest the themes...

```diff
   <html data-theme='dark'>
      ...
      <div data-theme='light'>
         ...
      </div>

      <div data-theme='forest'>
         ...
      </div>
   </html>
```



#### With <samp>class</samp>

For [variants](https://github.com/L-Blondy/tw-colors/tree/master#variants) to work properly in nested themes, an empty `data-theme` attribute must be added alongside the nested theme `class`

```diff
   <html class='dark'>
      ...
      <div data-theme class='light'>
         ...
      </div>

      <div data-theme class='forest'>
         ...
      </div>
   </html>
```


<details>
   <summary>
      <strong> Caveat: avoid opacity in the color definition </strong>
   </summary>
   When using nested themes, it is better not to provide a base opacity in your color definitions.

   With this setup the *0.8* opacity defined on the primary color of the "parent" theme will be inherited by the "child" theme's primary color.

   ```js
   createThemes({
      parent: { 
         'primary': 'hsl(50 50% 50% / 0.8)', // avoid this
         'secondary': 'darkblue',
      },
      child: { 
         'primary': 'turquoise',
         'secondary': 'tomato',
      },
   })
   ```


   ```html
   <html data-theme='parent'>

      <div data-theme='child'>
         <!-- The primary color has an unexpected 0.8 opacity -->
         <button class='bg-primary'>Click me</button>
        
        ...
      </div>
   </html>  
   ```

</details>

###  Variants

Based on the current theme, specific styles can be applied using variants.

**Note:** In the following example the variants would have no effect with `data-theme='light'`

```html
   <!-- Use "serif" font for the dark theme only -->
   <div data-theme='dark' class='font-sans dark:font-serif'>
      ...
      <div>Serif font here</div>

      <!-- this button is rounded when the theme is `dark` -->
      <button class='dark:rounded'>Click Me</button>
   </div>
```

*See the [options](https://github.com/L-Blondy/tw-colors/tree/master#producethemevariant) to customize the variant name*


<details>
   <summary>
      <strong> Caveat: group-{modifier} </strong>
   </summary>
   Always use the group variant before the theme variant.

   ```html
      <html class='theme-dark'>
         ...
         <div class='group'>
            <div class='theme-dark:group-hover:bg-red-500'>
               ❌ the group variant does not work
            </div>
            <div class='group-hover:theme-dark:bg-red-500'>
               ✅ the group variant works properly
            </div>
         </div>    
      </html>
   ```
</details>

<details>
   <summary>
      <strong> Caveat: inherited properties </strong>
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

### CSS prefers-color-scheme

*See the [default theme option](https://github.com/L-Blondy/tw-colors/tree/master#defaulttheme)*

### CSS color-scheme

`createThemes` also accepts a function that exposes the `light` and `dark` functions. \
To apply the `color-scheme` CSS property, simply wrap a theme with `light` or `dark`."


See the [MDN docs][mdn-color-scheme] for more details on this feature.

*tailwind.config.js*
```js
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
```

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

*See the [options](https://github.com/L-Blondy/tw-colors/tree/master#producecssvariable) to customize the css variables*

## Options

The options can be passed as the second argument to the plugin

```js
createThemes({
   // your colors config here...
}, {
   produceCssVariable: (colorName) => `--twc-${colorName}`,
   produceThemeClass: (themeName) => `theme-${themeName}`
   produceThemeVariant: (themeName) => `theme-${themeName}`
   defaultTheme: 'light'
   strict: false
})
```

### <samp>defaultTheme</samp>

The default theme to use, think of it as a fallback theme when no theme is declared.

The default theme can be chosen according to the user preference (see [MDN prefers-color-scheme][mdn-prefers-color-scheme])

*Example*
```js
createThemes({
   'light': { 
      'primary': 'steelblue',
   },
   'dark': { 
      'primary': 'turquoise',
   },
}, {
   defaultTheme: {
      /**
       * when `@media (prefers-color-scheme: light)` is matched, 
       * the default theme is the "light" theme 
       */
      light: 'light', 
      /**
       * when `@media (prefers-color-scheme: dark)` is matched, 
       * the default theme is the "dark" theme 
       */
      dark: 'dark', 
   }
})
```

...or simply set to one theme

*Example*
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

### <samp>strict</samp>

**default**: `false`

If `false` invalid colors are ignored. \
If `true` invalid colors produce an error.

*Example*
```js
createThemes({
   'light': { 
      // invalid color
      'primary': 'redish',
   },
   'dark': { 
      'primary': 'turquoise',
   },
}, {
   // an error will be thrown
   strict: true
})
```

### <samp>produceCssVariable</samp>

**default**: <code>(colorName) => \`--twc-${colorName}\`</code>

Customize the css variables generated by the plugin.

With the below configuration, the following variables will be created:
* `--a-primary-z` (instead of *twc-primary*)
* `--a-secondary-z` (instead of *twc-secondary*)
* `--a-brand-z` (instead of *twc-brand*)

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
   produceCssVariable: (colorName) => `--a-${colorName}-z`
})
```

### <samp>produceThemeClass</samp>

**default**: <code>(themeName) => themeName</code>

Customize the classNames of the themes and variants

With the below configuration, the following theme classNames and variants will be created: 
* `theme-light` (instead of *light*)
* `theme-dark` (instead of *dark*)


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
   produceThemeClass: (themeName) => `theme-${themeName}`
})
```

```html
<html class='theme-dark'>
   ...
   <button class='theme-dark:rounded'>
      Click Me
   </button>
   ...
</html>
```

### <samp>produceThemeVariant</samp>

**default**: same as `produceThemeClass`

Customize the variants

With the below configuration, the following variants will be created: 
* `theme-light` (instead of *light*)
* `theme-dark` (instead of *dark*)


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
   produceThemeVariant: (themeName) => `theme-${themeName}`
})
```

```html
<html data-theme='dark'>
   ...
   <button class='theme-dark:rounded'>
      Click Me
   </button>
   ...
</html>
```

<div align="center">

Please share

[![][tweet]][tweet-url]

</div >

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsaadeghi%2Fdaisyui
[tweet-url]: https://twitter.com/intent/tweet?text=tw-colors%0ATailwind%20color%20themes%20made%20easy!%0Ahttps://github.com/L-Blondy/tw-colors
[tailwind-intellisense-url]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
[mdn-color-scheme]: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
[mdn-prefers-color-scheme]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
<!-- https://github.com/L-Blondy/tw-colors/blob/master/README.md -->
