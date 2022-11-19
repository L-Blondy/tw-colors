import { ComponentProps } from 'react';

interface Props extends ComponentProps<'svg'> {}

export const IconChevronDown = ({ strokeWidth, ...props }: Props) => (
   <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={strokeWidth || 2}
      {...props}
   >
      <path
         d="M4 9L9.29289 14.2929C9.68342 14.6834 10.3166 14.6834 10.7071 14.2929L16 9"
         stroke="#DADEE0"
         strokeLinecap="round"
      />
   </svg>
);
