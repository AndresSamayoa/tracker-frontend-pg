import { useState } from "react";
import AsyncSelect  from 'react-select/async';
import Select  from 'react-select';


export default function FormControl(props) {
      const [passType, setPassType] = useState('password');
      const [passIcon, setPassIcon] = useState('bi bi-eye');

  switch (props.type) {
    case 'text':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <input className="textInput" value={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'textArea':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <textarea className="textFieldInput" value={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'password':
      const handleToggle = () => {
        if (passType==='password'){
            setPassIcon('bi bi-eye-slash');
            setPassType('text');
        } else {
            setPassIcon('bi bi-eye');
            setPassType('password');
        }
      }
      return <div className="controlContainer">
          <div className="formControlLabelContainer">
            <span className="formControlLabel">{props.label}</span>
            <span class="passwordToogleInput" onClick={handleToggle}><i class={passIcon}></i></span>
          </div>
          <div className="inputSecundaryContainer">
              <input className="textInput" type={passType} value={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'checkbox':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <input type="checkbox" className="textInput" checked={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'date':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <input type="date" className="textInput" value={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'datetime':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <input type="datetime-local" className="textInput" value={props.value} onChange={props.setValue}/>
          </div>
      </div>
    case 'searcher':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <Select value={props.value} onChange={props.setValue} options={props.options} />
          </div>
      </div>
    case 'async-searcher':
      return <div className="controlContainer">
          <span className="formControlLabel">{props.label}</span>
          <div className="inputSecundaryContainer">
              <AsyncSelect loadOptions={props.selectSearcher} value={props.value} onChange={props.setValue} />
          </div>
      </div>
    default:
      break;
  }

}
