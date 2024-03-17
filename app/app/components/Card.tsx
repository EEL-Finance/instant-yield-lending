import React from 'react';

export interface CardProps {
  children: React.ReactNode
}

export default function Card({ children }: CardProps) {
  return (
    <div className='p-6 bg-slate-700 bg-opacity-80 shadow-lg drop-shadow-lg border-slate-500 rounded-xl'>
      {children}
    </div>
    )
}