import { Editor } from './Editor';
import styles from './Playground.module.css';
import { DropdownButton } from './DropdownButton';

export const Playground = () => {
   const handleChangeTheme = (theme) => {
      console.log(theme);
   };

   return (
      <section className={styles.section}>
         <div className="thin-container">
            <DropdownButton value="" onChange={() => console.log('click')} />
         </div>

         <div className="grid grid-cols-2 gap-10">
            <Editor />
            <Editor />
         </div>
      </section>
   );
};
