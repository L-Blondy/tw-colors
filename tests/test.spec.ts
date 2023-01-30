import { resolveConfig } from '../lib';
import { describe, expect, test } from 'vitest';

describe('test vitest', () => {
   test('Variants', () => {
      const { variants } = resolveConfig({
         light: {},
         dark: {},
         halloween: {},
      });

      expect(variants).toEqual([
         {
            name: 'theme-light',
            definition: [`&.theme-light`, `&[data-theme='light']`],
         },
         {
            name: 'theme-dark',
            definition: [`&.theme-dark`, `&[data-theme='dark']`],
         },
         {
            name: 'theme-halloween',
            definition: [`&.theme-halloween`, `&[data-theme='halloween']`],
         },
      ]);
   });

   test('Utilities', () => {
      const { utilities } = resolveConfig({
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
         '.theme-hsl,[data-theme="hsl"]': {
            'color-scheme': 'initial',
            '--twc-c1': '1 2% 3%',
            '--twc-c2': '1 2% 3%',
            '--twc-c3': '1 2% 3%',
            '--twc-c3-opacity': '0.50',
            '--twc-c4': '1 2% 3%',
            '--twc-c4-opacity': '0.50',
         },
         '.theme-rgb,[data-theme="rgb"]': {
            'color-scheme': 'initial',
            '--twc-c1': '0 100% 50%',
            '--twc-c2': '0 100% 50%',
            '--twc-c3': '0 100% 50%',
            '--twc-c3-opacity': '0.50',
            '--twc-c4': '0 100% 50%',
            '--twc-c4-opacity': '0.50',
         },
         '.theme-hex,[data-theme="hex"]': {
            'color-scheme': 'initial',
            '--twc-c1': '0 100% 50%',
            '--twc-c2': '0 100% 50%',
            '--twc-c2-opacity': '0.50',
         },
         '.theme-colorName,[data-theme="colorName"]': {
            'color-scheme': 'initial',
            '--twc-red': '0 100% 50%',
         },
      });
   });

   test('color-scheme', () => {
      const { utilities } = resolveConfig(({ light, dark }) => ({
         t1: {
            c1: 'red',
         },
         t2: light({
            c1: 'red',
         }),
         t3: dark({
            c1: 'red',
         }),
      }));

      expect(utilities).toEqual({
         '.theme-t1,[data-theme="t1"]': {
            'color-scheme': 'initial',
            '--twc-c1': '0 100% 50%',
         },
         '.theme-t2,[data-theme="t2"]': {
            'color-scheme': 'light',
            '--twc-c1': '0 100% 50%',
         },
         '.theme-t3,[data-theme="t3"]': {
            'color-scheme': 'dark',
            '--twc-c1': '0 100% 50%',
         },
      });
   });
});
