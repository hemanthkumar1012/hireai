import React from 'react';
import { Cpu } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-accent1 rounded-2xl text-white shadow-soft">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-brand-text">
              ApplyRight
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-surface1 py-8 px-5 border border-brand-border shadow-soft rounded-3xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
