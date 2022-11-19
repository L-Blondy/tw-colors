import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from 'src/utils';
import { IconChevronDown } from './IconChevronDown';
import { EditorTheme } from './Playground';

interface Props {
   options: EditorTheme[];
   value: EditorTheme;
   onChange: (theme: EditorTheme) => void;
   label?: string;
}

export const DropdownButton = ({
   label,
   options = [],
   value,
   onChange,
}: Props) => {
   return (
      <div className="relative">
         {label && <div className="mb-2">{label}:</div>}

         <Listbox value={value} onChange={onChange}>
            <Listbox.Button
               className={cn`
                  h-14
                  w-full
                  px-5
                  bg-downlight/10
                  rounded-lg
                  -text-base-content
                  text-left
                  font-medium
                  flex
                  items-center
                  justify-between
                  text-base-content-emphasis
                  tracking-wider
               `}
            >
               {value}

               <IconChevronDown />
            </Listbox.Button>
            <Listbox.Options
               className={cn`
                  absolute
                  bg-highlight/10
                  top-full
                  translate-y-1
                  inset-x-0
                  flex
                  flex-col
                  py-4
                  rounded-lg
                  focus-visible:outline-none
                  backdrop-blur-lg
               `}
            >
               {options.map((option) => (
                  <Listbox.Option
                     key={`option-${option}`}
                     value={option}
                     as={Fragment}
                  >
                     {({ active }) => (
                        <li
                           className={cn`
                              ${active && 'bg-downlight/20'}
                              cursor-pointer
                              h-8
                              flex
                              items-center
                              px-5
                              text-base-content-emphasis
                           `}
                        >
                           {option}
                        </li>
                     )}
                  </Listbox.Option>
               ))}
            </Listbox.Options>
         </Listbox>
      </div>
   );
};
