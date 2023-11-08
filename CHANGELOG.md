# Changelog

## [3.3.0](https://github.com/L-Blondy/tw-colors/compare/v3.2.0...v3.3.1) - 2023-10-30

### Added
- Added support for `prefers-color-scheme`

## [3.2.0](https://github.com/L-Blondy/tw-colors/compare/v3.1.2...v3.2.0) - 2023-10-27

### Fixed
- [[#30](https://github.com/L-Blondy/tw-colors/issues/30)] - The colors defined via the plugin now properly override tailwind's default colors in case of name clash.

### Breaking changes:
- NativeWind 2 with Next.js is no longer supported

## [3.1.2](https://github.com/L-Blondy/tw-colors/compare/v3.1.0...v3.1.2) - 2023-10-23

### Fixed
- Fixed intellisense for the theme class

## [3.1.0](https://github.com/L-Blondy/tw-colors/compare/v3.0.3...v3.1.0) - 2023-10-23

### Fixed
- [[#26](https://github.com/L-Blondy/tw-colors/issues/26)] - NativeWind 2 with the Next.js setup is now supported.

## [3.0.3](https://github.com/L-Blondy/tw-colors/compare/v3.0.0...v3.0.3) - 2023-09-04

### Added
- Added support for group modifiers with theme variants

## [3.0.0](https://github.com/L-Blondy/tw-colors/compare/v2.2.0...v3.0.0) - 2023-09-04

### Added
- The variants can now be declared anywhere without having to redeclare the theme.
- New option `produceThemeVariant` to customize the variant names. It will fallback to `produceThemeClass` if omitted

### breaking changes:
- Renamed the option `getCssVariable` to `produceCssVariable`.
- Renamed the option `getThemeClassName` to `produceThemeClass`. The default return value is now the `themeName` instead of <code>`theme-${themeName}`</code>

## [2.2.0](https://github.com/L-Blondy/tw-colors/compare/v2.1.1...v2.2.0) - 2023-08-22

### Added

- `strict` option. If `false` (default) invalid colors are ignored, if `true` invalid colors throw an error

## [2.1.1](https://github.com/L-Blondy/tw-colors/compare/v2.1.0...v2.1.1) - 2023-08-21

### Fixed

- Fixed a typescript error when using a functional config and the defaultTheme option

## [2.1.0](https://github.com/L-Blondy/tw-colors/compare/v2.0.3...v2.1.0) - 2023-08-21

### breaking changes:

- `resolveConfig` was renamed to `resolveTwcConfig`
- Only two types are exposed: `TwcConfig` and `TwcOptions`, corresponding to `createThemes(TwcConfig, TwcOptions)` and `resolveTwcConfig(TwcConfig, TwcOptions)`. Previously exposed types are no longer valid.

### Added

- `defaultTheme` option 

## [2.0.3](https://github.com/L-Blondy/tw-colors/compare/v1.2.6...v2.0.3) - 2023-08-06

### breaking changes:

- Dropped support for the `cssVariablePrefix` and `cssVariableSuffix` options. Check out the new `getCssVariable` Option

### Added

- `getCssVariable` option to customize the css variables.
- `getThemeClassName` option to customize the generated theme classNames and variants.

## [1.2.6](https://github.com/L-Blondy/tw-colors/compare/v1.2.5...v1.2.6) - 2023-05-03

### Fixed

- [[#11](https://github.com/L-Blondy/tw-colors/issues/11)] - Removed the **cross-var** npm package

## [1.2.5](https://github.com/L-Blondy/tw-colors/compare/v1.2.4...v1.2.5) - 2023-04-26

### Added

- [[#10](https://github.com/L-Blondy/tw-colors/issues/10)] - added options to customize the CSS variables: `cssVariablePrefix`, `cssVariableSuffix`

## [1.2.4](https://github.com/L-Blondy/tw-colors/compare/v1.2.1...v1.2.4) - 2023-04-20

### Fixed

- [[#9](https://github.com/L-Blondy/tw-colors/issues/9)] - fixed missing support for '/' in color names

## [1.2.1](https://github.com/L-Blondy/tw-colors/compare/v1.2.0...v1.2.1) - 2023-04-13

### Fixed

- [[#7](https://github.com/L-Blondy/tw-colors/issues/7)] - fixed missing support for DEFAULT colors

## [1.2.0](https://github.com/L-Blondy/tw-colors/compare/v1.1.6...v1.2.0) - 2023-03-29

### Added

- support for esm

### Fixed

- [[#6](https://github.com/L-Blondy/tw-colors/issues/6)] - increased color conversion precision to 1 decimal 