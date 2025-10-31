


import React, { ReactNode } from 'react';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-500 hover:bg-slate-600 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Card Component
// Fix: Allow Card component to accept onClick and other div attributes.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg shadow p-6 dark:border dark:border-slate-700 ${className || ''}`.trim()} {...props}>
    {children}
  </div>
);

// StatCard Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color?: string;
    onClick?: () => void;
}
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'bg-indigo-500', onClick }) => (
    <div onClick={onClick} className={onClick ? 'cursor-pointer transition-transform transform hover:-translate-y-1' : ''}>
        <Card>
            <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 text-white ${color}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
            </div>
        </Card>
    </div>
);


// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">{'\u00D7'}</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Table Component
interface TableProps {
  headers: string[];
  children: ReactNode;
}
export const Table: React.FC<TableProps> = ({ headers, children }) => (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow dark:border dark:border-slate-700">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                    {headers.map((header) => (
                        <th key={header} scope="col" className="px-6 py-3">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
);

// Fix: Allow TableRow to accept onClick and other table row attributes.
// Fix: Changed props type to React.ComponentProps<'tr'> for more robust type inference.
export const TableRow: React.FC<React.ComponentProps<'tr'>> = ({children, className, ...props}) => (
    <tr className={`border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 ${className || ''}`.trim()} {...props}>
        {children}
    </tr>
)

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({children, className, ...props}) => (
    <td className={`px-6 py-4 ${className || ''}`.trim()} {...props}>{children}</td>
)


// Form Components
export const Label: React.FC<{ htmlFor: string, children: ReactNode, className?: string }> = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${className}`}>
        {children}
    </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-400 dark:disabled:border-slate-700 ${props.className}`}
    />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-400 dark:disabled:border-slate-700 ${props.className}`}
    >
        {props.children}
    </select>
);