/**
 * Template string based utility to compute classNames. \
 * Removes falsy values & whitespace
 *
 * @example
 * <div
 *    className={Dom.cn`
 * 		flex
 *       items-center
 *       ${isActive && 'bg-green-500'}
 *       ${isVisible ? 'flex': 'hidden'}
 *    `}
 *    style={{...}}
 *    onMouseOver={...}
 * >
 *    Some children here...
 * </div>
 */
export const cn = (template: TemplateStringsArray, ...args: any[]) => {
   let res = '';

   for (let i = 0; i < template.length; i++) {
      res += `${template[i]}${args[i] || ''} `;
   }
   return res.replace(/([\r\n\s]+)/gm, ' ').trim();
};
