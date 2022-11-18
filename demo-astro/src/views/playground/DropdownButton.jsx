import { cn } from 'src/utils';
import { Fragment, useState } from 'react';
import { IconChevronDown } from './IconChevronDown';
import themes from 'src/themes.json';

export const DropdownButton = () => {
   const options = Object.keys(themes);
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Fragment>
         <label>
            <div className="mb-2">Editor theme:</div>
            <button
               onClick={() => setIsOpen((v) => !v)}
               className={cn`
                  h-14
                  w-full
                  px-5
                  bg-downlight/10
                  rounded-lg
                  text-base-content
                  text-left
                  font-medium
                  flex
                  items-center
                  justify-between
               `}
            >
               poimandres
               <IconChevronDown />
            </button>
         </label>

         <div
            className={cn`
               flex
               transition-opacity
               duration-500
               ${!isOpen && 'opacity-0 pointer-events-none'}
            `}
         >
            <ul>
               {options.map((option) => (
                  <li key={option}>{option}</li>
               ))}
            </ul>
         </div>
      </Fragment>
   );
};
