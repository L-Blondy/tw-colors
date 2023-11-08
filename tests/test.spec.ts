import { resolveTwcConfig } from '../lib';
import { describe, expect, test } from 'vitest';

test('Variants', () => {
   const { variants } = resolveTwcConfig({
      light: {},
      dark: {},
      halloween: {},
   });

   expect(variants).toEqual([
      {
         name: 'light',
         definition: [
            '.light&',
            ':is(.light > &:not([data-theme]))',
            ':is(.light &:not(.light [data-theme]:not(.light) * ))',
            ':is(.light:not(:has([data-theme])) &:not([data-theme]))',
            "[data-theme='light']&",
            ":is([data-theme='light'] > &:not([data-theme]))",
            ":is([data-theme='light'] &:not([data-theme='light'] [data-theme]:not([data-theme='light']) * ))",
            ":is([data-theme='light']:not(:has([data-theme])) &:not([data-theme]))",
         ],
      },
      {
         name: 'dark',
         definition: [
            '.dark&',
            ':is(.dark > &:not([data-theme]))',
            ':is(.dark &:not(.dark [data-theme]:not(.dark) * ))',
            ':is(.dark:not(:has([data-theme])) &:not([data-theme]))',
            "[data-theme='dark']&",
            ":is([data-theme='dark'] > &:not([data-theme]))",
            ":is([data-theme='dark'] &:not([data-theme='dark'] [data-theme]:not([data-theme='dark']) * ))",
            ":is([data-theme='dark']:not(:has([data-theme])) &:not([data-theme]))",
         ],
      },
      {
         name: 'halloween',
         definition: [
            '.halloween&',
            ':is(.halloween > &:not([data-theme]))',
            ':is(.halloween &:not(.halloween [data-theme]:not(.halloween) * ))',
            ':is(.halloween:not(:has([data-theme])) &:not([data-theme]))',
            "[data-theme='halloween']&",
            ":is([data-theme='halloween'] > &:not([data-theme]))",
            ":is([data-theme='halloween'] &:not([data-theme='halloween'] [data-theme]:not([data-theme='halloween']) * ))",
            ":is([data-theme='halloween']:not(:has([data-theme])) &:not([data-theme]))",
         ],
      },
   ]);
});

test('Utilities', () => {
   const { utilities } = resolveTwcConfig({
      hsl: {
         c1: 'hsl(1, 2%, 3%)',
         c2: 'hsl(1 2% 3%)',
         c3: 'hsl(1, 2%, 3% / 0.5)',
         c4: 'hsla(1, 2%, 3%, 0.5)',
      },
      rgb: {
         c1: 'rgb(255, 0, 0)',
         c2: 'rgb(255 0 0)',
         c3: 'rgb(255 0 0 / 0.5)',
         c4: 'rgba(255, 0, 0, 0.5)',
      },
      hex: {
         c1: '#ff0000',
         c2: '#ff000080',
      },
      colorName: {
         red: 'red',
      },
   });

   expect(utilities).toEqual({
      '.hsl,[data-theme="hsl"]': {
         '--twc-c1': '1 2% 3%',
         '--twc-c2': '1 2% 3%',
         '--twc-c3': '1 2% 3%',
         '--twc-c3-opacity': '0.50',
         '--twc-c4': '1 2% 3%',
         '--twc-c4-opacity': '0.50',
      },
      '.rgb,[data-theme="rgb"]': {
         '--twc-c1': '0 100% 50%',
         '--twc-c2': '0 100% 50%',
         '--twc-c3': '0 100% 50%',
         '--twc-c3-opacity': '0.50',
         '--twc-c4': '0 100% 50%',
         '--twc-c4-opacity': '0.50',
      },
      '.hex,[data-theme="hex"]': {
         '--twc-c1': '0 100% 50%',
         '--twc-c2': '0 100% 50%',
         '--twc-c2-opacity': '0.50',
      },
      '.colorName,[data-theme="colorName"]': {
         '--twc-red': '0 100% 50%',
      },
   });
});

test('color-scheme', () => {
   const { utilities } = resolveTwcConfig(({ light, dark }) => ({
      t1: {
         c1: 'red',
         'slash/slash': 'red',
      },
      t2: light({
         c1: 'red',
      }),
      t3: dark({
         c1: 'red',
      }),
   }));

   expect(utilities).toEqual({
      '.t1,[data-theme="t1"]': {
         '--twc-c1': '0 100% 50%',
         '--twc-slash\\/slash': '0 100% 50%',
      },
      '.t2,[data-theme="t2"]': {
         'color-scheme': 'light',
         '--twc-c1': '0 100% 50%',
      },
      '.t3,[data-theme="t3"]': {
         'color-scheme': 'dark',
         '--twc-c1': '0 100% 50%',
      },
   });
});

describe('Nested colors', () => {
   test('Utilities', () => {
      const { utilities } = resolveTwcConfig({
         light: {
            primary: {
               100: 'red',
               200: 'blue',
            },
            secondary: {
               100: 'rgb(255 0 0 / 0.5)',
               200: 'rgb(255 0 0 / 0.7)',
            },
         },
         dark: {
            primary: {
               100: 'lime',
               200: 'pink',
            },
            secondary: {
               100: 'rgb(255 0 0 / 0.6)',
               200: 'rgb(255 0 0 / 0.8)',
            },
         },
      });
      expect(utilities).toEqual({
         '.light,[data-theme="light"]': {
            '--twc-primary-100': '0 100% 50%',
            '--twc-primary-200': '240 100% 50%',
            '--twc-secondary-100': '0 100% 50%',
            '--twc-secondary-100-opacity': '0.50',
            '--twc-secondary-200': '0 100% 50%',
            '--twc-secondary-200-opacity': '0.70',
         },
         '.dark,[data-theme="dark"]': {
            '--twc-primary-100': '120 100% 50%',
            '--twc-primary-200': '349.5 100% 87.6%',
            '--twc-secondary-100': '0 100% 50%',
            '--twc-secondary-100-opacity': '0.60',
            '--twc-secondary-200': '0 100% 50%',
            '--twc-secondary-200-opacity': '0.80',
         },
      });
   });

   test('color-scheme', () => {
      const { utilities } = resolveTwcConfig(({ light, dark }) => ({
         light: light({
            primary: {
               100: 'red',
               200: 'blue',
            },
            secondary: {
               100: 'rgb(255 0 0 / 0.5)',
               200: 'rgb(255 0 0 / 0.7)',
            },
         }),
         dark: dark({
            primary: {
               100: 'lime',
               200: 'pink',
            },
            secondary: {
               100: 'rgb(255 0 0 / 0.6)',
               200: 'rgb(255 0 0 / 0.8)',
               nested: {
                  100: 'rgb(255 0 0 / 0.9)',
                  200: 'rgb(255 0 0 / 0.1)',
               },
            },
         }),
         none: {
            primary: {
               100: 'lime',
               200: 'pink',
            },
            secondary: {
               100: 'hsl(50 10% 12% / 0.6)',
               200: 'hsl(60 11% 13% / 0.8)',
            },
         },
      }));

      expect(utilities).toEqual({
         '.light,[data-theme="light"]': {
            'color-scheme': 'light',
            '--twc-primary-100': '0 100% 50%',
            '--twc-primary-200': '240 100% 50%',
            '--twc-secondary-100': '0 100% 50%',
            '--twc-secondary-100-opacity': '0.50',
            '--twc-secondary-200': '0 100% 50%',
            '--twc-secondary-200-opacity': '0.70',
         },
         '.dark,[data-theme="dark"]': {
            'color-scheme': 'dark',
            '--twc-primary-100': '120 100% 50%',
            '--twc-primary-200': '349.5 100% 87.6%',
            '--twc-secondary-100': '0 100% 50%',
            '--twc-secondary-100-opacity': '0.60',
            '--twc-secondary-200': '0 100% 50%',
            '--twc-secondary-200-opacity': '0.80',
            '--twc-secondary-nested-100': '0 100% 50%',
            '--twc-secondary-nested-100-opacity': '0.90',
            '--twc-secondary-nested-200': '0 100% 50%',
            '--twc-secondary-nested-200-opacity': '0.10',
         },
         '.none,[data-theme="none"]': {
            '--twc-primary-100': '120 100% 50%',
            '--twc-primary-200': '349.5 100% 87.6%',
            '--twc-secondary-100': '50 10% 12%',
            '--twc-secondary-100-opacity': '0.60',
            '--twc-secondary-200': '60 11% 13%',
            '--twc-secondary-200-opacity': '0.80',
         },
      });
   });
});
