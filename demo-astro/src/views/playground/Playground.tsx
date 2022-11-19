import { Editor } from './Editor';
import { DropdownButton } from './DropdownButton';
import editorThemesConfig from 'src/themes-editor.json';
import { useState } from 'react';

export type EditorTheme = keyof typeof editorThemesConfig;

const themes: EditorTheme[] = Object.keys(editorThemesConfig) as any;

export const Playground = () => {
   const [theme, setTheme] = useState<EditorTheme>(themes[0]);

   const handleChangeTheme = (theme: EditorTheme) => {
      setTheme(theme);
   };

   return (
      <section
         className={'mt-12 py-12 px-6 sm:px-8 md:px-10 lg:px-12 bg-white/10'}
         style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}
      >
         <div className="thin-container">
            <DropdownButton
               label="Editor theme"
               options={themes}
               value={theme}
               onChange={handleChangeTheme}
            />
         </div>

         <div className="grid grid-cols-2 gap-10 mt-8">
            <Editor
               fileName="tailwind.config.js"
               type="json"
               content={editorThemesConfig}
               className="ml-auto"
            />
            <Editor fileName="index.html" type="html" content="todo" />
         </div>
      </section>
   );
};
