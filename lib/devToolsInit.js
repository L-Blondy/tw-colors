export const devToolsInit = async () => {
   const rules = getRules();
   const { render, html } = await import('https://unpkg.com/lit-html@2.4.0/lit-html.js');
   const helloTemplate = (name) => html`<div @click="console.log('test')">Hello ${name}!</div>`;
   // This renders <div>Hello Steve!</div> to the document body
   render(helloTemplate('Steve'), document.body);
   // This updates to <div>Hello Kevin!</div>, but only updates the ${name} part
   render(helloTemplate('Kevin'), document.body);

   // switchTheme({rules,themeName:'monokai'})
};

function switchTheme({ rules, themeName, element = document.documentElement }) {
   const themeClassRegexp = new RegExp(`theme-(${Object.keys(rules).join('|')})`, 'g');
   const isUsingClassName = element.className.search(themeClassRegexp) !== -1;

   if (isUsingClassName) {
      element.className = element.className.replace(themeClassRegexp, `theme-${themeName}`);
   } else {
      element.dataset.theme = themeName;
   }
   Object.assign(element.style, rules[themeName]);
}

function getRules() {
   return [...document.styleSheets]
      .filter((styleSheet) => !styleSheet.href) // ignore external styles
      .map((stylesheet) => [...stylesheet.cssRules]) // contact all rules
      .flat()
      .filter((cssRule) => cssRule.cssText.startsWith('.twc-rule')) // extract the themes rules only
      .reduce((acc, cssRule) => {
         const themeName =
            cssRule.cssText
               .split(',')
               .map((slice) => slice.trim())
               .find((slice) => slice.startsWith('.theme'))
               ?.replace('.theme-', '') ?? '';
         const rules = Object.fromEntries(
            `${cssRule.cssText.split(/[{}]/g)[1]}`
               .trim()
               .split(';')
               .filter((slice) => slice !== '')
               .map((rule) => rule.split(':').map((slice) => slice.trim())),
         );
         acc[themeName] = rules;
         return acc;
      }, {});
}
