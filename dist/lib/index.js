"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  createThemes: () => createThemes,
  resolveConfig: () => resolveConfig,
  toHslaArray: () => toHslaArray
});
module.exports = __toCommonJS(lib_exports);
var import_color = __toESM(require("color"));
var import_plugin = __toESM(require("tailwindcss/plugin"));
var import_lodash = __toESM(require("lodash.foreach"));
var import_flat = __toESM(require("flat"));
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
  return (0, import_color.default)(colorValue).hsl().round().array();
};
var resolveConfig = (config = {}) => {
  const resolved = {
    variants: [],
    utilities: {},
    colors: {}
  };
  const configObject = typeof config === "function" ? config({ dark, light }) : config;
  (0, import_lodash.default)(configObject, (colors, themeName) => {
    const cssSelector = `.theme-${themeName},[data-theme="${themeName}"]`;
    resolved.utilities[cssSelector] = colors[SCHEME] ? {
      "color-scheme": colors[SCHEME]
    } : {};
    const flatColors = (0, import_flat.default)(colors, {
      safe: true,
      delimiter: "-"
    });
    resolved.variants.push({
      name: `theme-${themeName}`,
      definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`]
    });
    (0, import_lodash.default)(flatColors, (colorValue, colorName) => {
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
  return (0, import_plugin.default)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createThemes,
  resolveConfig,
  toHslaArray
});
//# sourceMappingURL=index.js.map