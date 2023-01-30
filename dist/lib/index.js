"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemes = exports.resolveConfig = void 0;
const color_1 = __importDefault(require("color"));
const plugin_1 = __importDefault(require("tailwindcss/plugin"));
const lodash_foreach_1 = __importDefault(require("lodash.foreach"));
const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';
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
const resolveConfig = (config = {}) => {
    const resolved = {
        variants: [],
        utilities: {},
        colors: {},
    };
    const configObject = typeof config === 'function' ? config({ dark, light }) : config;
    (0, lodash_foreach_1.default)(configObject, (colors, themeName) => {
        const cssSelector = `.theme-${themeName},[data-theme="${themeName}"]`;
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
            const [h, s, l, defaultAlphaValue] = (0, color_1.default)(colorValue).hsl().round().array();
            const twcColorVariable = `--${VAR_PREFIX}-${colorName}`;
            const twcOpacityVariable = `--${VAR_PREFIX}-${colorName}-opacity`;
            // set the css variable in "@layer utilities"
            resolved.utilities[cssSelector][twcColorVariable] = `${h} ${s}% ${l}%`;
            // if an alpha value was provided in the color definition, store it in a css variable
            if (defaultAlphaValue) {
                resolved.utilities[cssSelector][twcOpacityVariable] = defaultAlphaValue.toFixed(2);
            }
            // set the dynamic color in tailwind config theme.colors
            resolved.colors[colorName] = ({ opacityVariable, opacityValue }) => {
                // if the opacity is set  with a slash (e.g. bg-primary/90), use the provided value
                if (!isNaN(+opacityValue)) {
                    return `hsl(var(${twcColorVariable}) / ${opacityValue})`;
                }
                // if no opacityValue was provided (=it is not parsable to number)
                // the twcOpacityVariable (opacity defined in the color definition rgb(0, 0, 0, 0.5)) should have the priority
                // over the tw class based opacity(e.g. "bg-opacity-90")
                // This is how tailwind behaves as for v3.2.4
                if (opacityVariable) {
                    return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, var(${opacityVariable})))`;
                }
                return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, 1))`;
            };
        });
    });
    return resolved;
};
exports.resolveConfig = resolveConfig;
const createThemes = (config = {}) => {
    const resolved = (0, exports.resolveConfig)(config);
    return (0, plugin_1.default)(({ addUtilities, addVariant }) => {
        // add the css variables to "@layer utilities"
        addUtilities(resolved.utilities);
        // add the theme as variant e.g. "theme-[name]:text-2xl"
        resolved.variants.forEach((variant) => {
            addVariant(variant.name, variant.definition);
        });
    }, 
    // extend the colors config
    {
        theme: {
            extend: {
                // @ts-ignore
                colors: resolved.colors,
            },
        },
    });
};
exports.createThemes = createThemes;
