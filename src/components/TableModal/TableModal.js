import { useState } from 'react';

import DataTable from '../../components/DataTable/DataTable';
import Searcher from '../../components/Searcher/Searcher';

export default function TableModal (props) {

    const [searcher, setSearcher] = useState('');
    const [paramType, setParamType] = useState('');
    const [message, setMessage] = useState('');

    let search = ()=> props.searchData(searcher, setMessage);
    if (props.useType) search = ()=>  props.searchData(searcher, paramType, setMessage);


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
            useType={props.useType}

            typeLabel={props.typeLabel}
            typeValue={paramType}
            setTypeValue={setParamType}
            types={props.types}

            placeHolder={props.placeHolder}
            param={searcher}
            setParam={setSearcher}

            searchFn={search}
            cancelFn={clearTableData}
        />
        <p>{message}</p>
        <DataTable headers={props.tableColumns} rows={props.tableData} />
    </div>
}