import FormControl from "../formControl/FormControl";

export default function Searcher (props) {
    const setParam = (e) => {
        props.setParam(e.target.value);
    };
    const setStartDate = (e) => {
        props.setStartDate(e.target.value);
    };
    const setEndDate = (e) => {
        props.setEndDate(e.target.value);
    };

    if (props.useType) {
        return <div className='SearcherContainer'>
            <FormControl type="searcher" label={props.typeLabel} value={props.typeValue} setValue={props.setTypeValue} options={props.types} />
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    } else if (props.useDateRange) {
        return <div className='SearcherContainer'>
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            <div className="SearcherDateContainer">
                <label>Fecha de inicio</label>
                <input type="date" className='SearcherDateInput' label="Fecha de inicio" value={props.startDate} onChange={setStartDate} />
            </div>
            <div className="SearcherDateContainer">
                <label>Fecha de fin</label>
                <input type="date" className='SearcherDateInput' label="Fecha de fin" value={props.endDate} onChange={setEndDate} />
            </div>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    } else {
        return <div className='SearcherContainer'>
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    }
};
