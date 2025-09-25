import FormControl from "../formControl/FormControl";

export default function Searcher (props) {
    const setParam = (e) => {
        props.setParam(e.target.value);
    };

    if (props.useType) {
        return <div className='SearcherContainer'>
            <FormControl type="searcher" label={props.typeLabel} value={props.typeValue} setValue={props.setTypeValue} options={props.types} />
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
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
