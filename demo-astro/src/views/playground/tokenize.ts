import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import haml from 'highlight.js/lib/languages/haml';

hljs.registerLanguage('json', json);
hljs.registerLanguage('html', haml);

export const tokenize = {
   json: (json: Record<string, any>) => {
      const stringified = JSON.stringify(json, null, 3);
      return hljs.highlight(stringified, { language: 'json' }).value;
   },
   html: (raw: string) => {
      return hljs.highlight(raw, { language: 'html' }).value;
   },
};
