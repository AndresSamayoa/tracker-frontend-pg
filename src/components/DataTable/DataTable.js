
export default function DataTable(props) {
    let type = 'Screen';
    if (props.print > 0) type = 'Print';
    return <>
        {(() => {
            const headers = [];
            const rows = [];
            for (let i = 0; i < props.headers.length; i++) {
                const header = props.headers[i];
                if (i === 0) headers.push(<th key={`th-${header.field}`} className="dTableHeaderItems dTableHeaderStartItem">{header.text}</th>)
                else if (i === (props.headers.length - 1)) headers.push(<th key={`th-${header.field}`} className="dTableHeaderItems dTableHeaderEndItem">{header.text}</th>)
                else headers.push(<th key={`th-${header.field}`} className="dTableHeaderItems">{header.text}</th>)
            }

            for (let i = 0; i < props.rows.length; i++) {
                const rowData = props.rows[i];
                const rowComponents = [];
                for (const header of props.headers) {
                    if (rowData[header.field]) 
                        rowComponents.push(<td key={`tr-${i}-${header.field}`} className="dTableRowItems">{rowData[header.field]}</td>);
                }
                rows.push(<tr key={`tr-${i}`} className={`dTableRows dTableRow${i%2}${type}`}>{rowComponents}</tr>);
            }

            return <table className={`dTable${props.wide ? 'Wide' : '' }`}> 
                <thead className='dTableHeader'>{headers}</thead>
                {rows}
            </table>;
          })()}
    </>
}
