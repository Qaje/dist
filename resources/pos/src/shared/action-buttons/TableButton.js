import React from 'react';
import {Button} from 'react-bootstrap-v5';

const TableButton = ({buttonValue, to}) => {
    return(
        <div className='text-end order-2 mb-2'>
            <Button type='button' className='table-button' variant='primary' href={to}>{buttonValue}</Button>
        </div>
    )
}

export default TableButton;
