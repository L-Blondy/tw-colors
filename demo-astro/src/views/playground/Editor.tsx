import 'highlight.js/styles/night-owl.css';
import { tokenize } from './tokenize';

interface Props {
   fileName: string;
   type: 'json' | 'html';
   content: Record<string, any> | string;
   className?: string;
}

export const Editor = ({ fileName, content, type, className = '' }: Props) => {
   return (
      <div
         className={`bg-downlight/60 rounded-lg py-5 flex flex-col gap-4 w-full max-w-[596px] ${className}`}
      >
         <Header fileName={fileName} />
         <Body type={type} content={content} />
      </div>
   );
};

const Header = ({ fileName }: Pick<Props, 'fileName'>) => (
   <div className="grid grid-cols-3 items-center px-5">
      <div role="img" className="flex gap-2.5">
         <div className="bg-[#E8483D] h-3 w-3 rounded-full" />
         <div className="bg-[#E1B509] h-3 w-3 rounded-full" />
         <div className="bg-[#22C364] h-3 w-3 rounded-full" />
      </div>
      <div className="text-center opacity-60">{fileName}</div>
   </div>
);

const Body = ({ content, type }: Pick<Props, 'content' | 'type'>) => {
   const innerHTML = tokenize[type](content as any);

   return (
      <div className="px-5 max-h-96 overflow-auto">
         <pre>
            <code dangerouslySetInnerHTML={{ __html: innerHTML }} />
         </pre>
      </div>
   );
};
