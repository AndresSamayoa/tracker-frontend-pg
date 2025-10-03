import { useState } from 'react';

import DataTable from '../../components/DataTable/DataTable';
import Searcher from '../../components/Searcher/Searcher';

export default function TableModal (props) {

    const [searcher, setSearcher] = useState('');
    const [paramType, setParamType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    let search = ()=> props.searchData(searcher, setMessage);
    if (props.useType) search = ()=>  props.searchData(searcher, paramType, setMessage);
    if (props.useDateRange) search = ()=>  props.searchData(searcher, startDate, endDate,setMessage);


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
            useDateRange={props.useDateRange}

            typeLabel={props.typeLabel}
            typeValue={paramType}
            setTypeValue={setParamType}
            types={props.types}

            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}

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