import React from 'react';

export interface ContainerProps {
	children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
	return <div className='container mx-auto max-w-screen-lg px-4 py-4 lg:px-0'>{children}</div>
}
 