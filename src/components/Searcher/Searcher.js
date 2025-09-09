
export default function Searcher (props) {
    const setParam = (e) => {
        props.setParam(e.target.value);
    };

    return <div className='SearcherContainer'>
        <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
        <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
        <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
    </div>
};
