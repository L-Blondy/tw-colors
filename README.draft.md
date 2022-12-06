# Welcome to [tw-colors](https://github.com/L-Blondy/tw-colors)

The easiest & fastest way to add multiple color themes to Tailwind apps

## Why

**Problem:**
Tailwind's dark is impractical. Forget a "dark" variant somewhere and the styles are broken

Rather than having to add variants everywhere, the goal is to provide **multiple color themes** to any tailwind app **with just one className**

## Highlights

* 🚀 **No markup change required**, no need to refactor!
* 📦 **Zero impact** on the bundle size, it's just some CSS!
* ✨ **All color formats** are supported (HEX, rgb, hsl, color names...)
* 🤩 **Nested themes** support
* 💫 **Full [Tailwind CSS Intellisense][tailwind-intellisense-url] support** 🔥🔥🔥
 

## The Gist

Take your existing colors config, put it in the `createTheme` plugin and give it a name.

*tailwind.config.js*
```diff
+  const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      theme: {
         extends: {
            colors: {
-              primary: 'steelblue',
-              secondary: 'darkblue',
-              'base-100': '#f3f3f3',
            }
         },
      },
      plugins: [
+        createThemes({
+           light: { 
+              primary: 'steelblue',
+              secondary: 'darkblue',
+              'base-100': '#f3f3f3',
+           }
+        })
      ],
   };

```

Apply the `theme-[name]` class in your app

```diff
-  <div class='bg-base-100'>
+  <div class='bg-base-100 theme-light'>
      <h1 class='text-primary'>...</h1>
      <p class='text-secondary'>...</p>
   </div>
```

That's it, you site has a light theme!




## Nested themes

## Coming soon...

## 📀 Install now!

## ✨ Demo

See the demo [here](...)

<div align="center">

Please share

[![][tweet]][tweet-url]

</div >

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsaadeghi%2Fdaisyui
[tweet-url]: https://twitter.com/intent/tweet?text=tw-colors%0ATailwind%20color%20themes%20made%20easy!%0AURL_TO_GITHUB
[daisyui-url]: https://daisyui.com/
[tailwind-intellisense-url]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
