import { useState } from 'react';

import DataTable from '../../components/DataTable/DataTable';
import Searcher from '../../components/Searcher/Searcher';

export default function TableModal (props) {

    const [searcher, setSearcher] = useState('');
    const [message, setMessage] = useState('');

    const cerrarModal = () => {
        props.closeModal();
    }
    
    const clearTableData = () => {
        props.setTableData([]);
    }

    return <div className='TableModalComponent'>
        <div className='closeModalDiv'>
            <i onClick={cerrarModal} class="bi bi-x closeIcon" />
        </div>
        <Searcher 
            placeHolder={props.placeHolder}

            param={searcher}
            setParam={setSearcher}

            searchFn={() => props.searchData(searcher, setMessage)}
            cancelFn={clearTableData}
        />
        <p>{message}</p>
        <DataTable headers={props.tableColumns} rows={props.tableData} />
    </div>
}