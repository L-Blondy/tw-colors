"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemes = void 0;
const color_1 = __importDefault(require("color"));
const plugin_1 = __importDefault(require("tailwindcss/plugin"));
const lodash_foreach_1 = __importDefault(require("lodash.foreach"));
const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';
const RULE_PREFIX = '.twc-rule';
const dark = (colors) => {
    return {
        [SCHEME]: 'dark',
        ...colors,
    };
};
const light = (colors) => {
    return {
        [SCHEME]: 'light',
        ...colors,
    };
};
function toHslContent(color) {
    const [h, s, l] = (0, color_1.default)(color).hsl().round().array();
    return `${h} ${s}% ${l}%`;
}
const createThemes = (config = {}) => {
    const resolved = {
        variants: [],
        utilities: {},
        colors: {},
    };
    const configObject = typeof config === 'function' ? config({ dark, light }) : config;
    (0, lodash_foreach_1.default)(configObject, (colors, themeName) => {
        const cssSelector = `${RULE_PREFIX},.theme-${themeName},[data-theme="${themeName}"]`;
        resolved.utilities[cssSelector] = {
            'color-scheme': colors[SCHEME] || 'initial',
        };
        // resolved.variants
        resolved.variants.push({
            name: `theme-${themeName}`,
            definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`],
        });
        (0, lodash_foreach_1.default)(colors, (colorValue, colorName) => {
            // this case was handled above
            if (colorName === SCHEME)
                return;
            // set the css variable in "@layer utilities"
            resolved.utilities[cssSelector][`--${VAR_PREFIX}-${colorName}`] =
                toHslContent(colorValue);
            // set the dynamic color in tailwind config theme.colors
            resolved.colors[colorName] = `hsl(var(--${VAR_PREFIX}-${colorName}) / <alpha-value>)`;
        });
    });
    return (0, plugin_1.default)(({ addUtilities, addVariant }) => {
        // add the css variables to "@layer utilities"
        addUtilities(resolved.utilities);
        // add the theme as variant e.g. "theme-[name]:text-2xl"
        resolved.variants.forEach((variant) => {
            console.log(variant.name, variant.definition);
            addVariant(variant.name, variant.definition);
        });
    }, 
    // extend the colors config
    {
        theme: { extend: { colors: resolved.colors } },
    });
};
exports.createThemes = createThemes;
