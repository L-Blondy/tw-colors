// lib/index.ts
import Color from "color";
import plugin from "tailwindcss/plugin";
import forEach from "lodash.foreach";
import flatten from "flat";
var SCHEME = Symbol("color-scheme");
var VAR_PREFIX = "twc";
var dark = (colors) => {
  return {
    [SCHEME]: "dark",
    ...colors
  };
};
var light = (colors) => {
  return {
    [SCHEME]: "light",
    ...colors
  };
};
var toHslaArray = (colorValue) => {
  return Color(colorValue).hsl().round().array();
};
var resolveConfig = (config = {}) => {
  const resolved = {
    variants: [],
    utilities: {},
    colors: {}
  };
  const configObject = typeof config === "function" ? config({ dark, light }) : config;
  forEach(configObject, (colors, themeName) => {
    const cssSelector = `.theme-${themeName},[data-theme="${themeName}"]`;
    resolved.utilities[cssSelector] = colors[SCHEME] ? {
      "color-scheme": colors[SCHEME]
    } : {};
    const flatColors = flatten(colors, {
      safe: true,
      delimiter: "-"
    });
    resolved.variants.push({
      name: `theme-${themeName}`,
      definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`]
    });
    forEach(flatColors, (colorValue, colorName) => {
      if (colorName === SCHEME)
        return;
      const [h, s, l, defaultAlphaValue] = toHslaArray(colorValue);
      const twcColorVariable = `--${VAR_PREFIX}-${colorName}`;
      const twcOpacityVariable = `--${VAR_PREFIX}-${colorName}-opacity`;
      resolved.utilities[cssSelector][twcColorVariable] = `${h} ${s}% ${l}%`;
      if (typeof defaultAlphaValue === "number") {
        resolved.utilities[cssSelector][twcOpacityVariable] = defaultAlphaValue.toFixed(2);
      }
      resolved.colors[colorName] = ({ opacityVariable, opacityValue }) => {
        if (!isNaN(+opacityValue)) {
          return `hsl(var(${twcColorVariable}) / ${opacityValue})`;
        }
        if (opacityVariable) {
          return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, var(${opacityVariable})))`;
        }
        return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, 1))`;
      };
    });
  });
  return resolved;
};
var createThemes = (config = {}) => {
  const resolved = resolveConfig(config);
  return plugin(
    ({ addUtilities, addVariant }) => {
      addUtilities(resolved.utilities);
      resolved.variants.forEach((variant) => {
        addVariant(variant.name, variant.definition);
      });
    },
    // extend the colors config
    {
      theme: {
        extend: {
          // @ts-ignore
          colors: resolved.colors
        }
      }
    }
  );
};
export {
  createThemes,
  resolveConfig,
  toHslaArray
};
//# sourceMappingURL=index.mjs.map