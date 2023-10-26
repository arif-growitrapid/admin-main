import React from 'react'
import Structure from './structure';

type Props = {
    searchParams: {
        [key: string]: string
    }
}

export default function page(props: Props) {

    return (
        <div className='h-full w-full'>
            <Structure
                searchParams={props.searchParams}
            />
        </div>
    )
}