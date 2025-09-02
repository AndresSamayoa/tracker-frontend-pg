
export default function Loader ({show}) {
  return <div shows style={{display: show ? '' : 'none'}} className="formLoaderContainer">
        <p>Cargando&#8230;</p>
        <span className="formLoader"><i className="bi bi-arrow-repeat"></i></span>
    </div>
  ;
}