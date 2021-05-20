import React, { useGlobal, useState, useEffect } from 'reactn'
import axios from 'axios';
import config from '../../config';

function UploadView({ match, location }) {

  // Global State
  const [ agent, setAgent ] = useGlobal("agent")

  // File State
  const [ files, setFiles] = useState({})
  const [ statusEditable, setStatusEditable ] = useState(false)

  // Success
  const [ successDisplay, setSuccessDisplay ] = useState("none")
  const [ successMessage, setSuccessMessage ] = useState("")
  
  // Error
  const [ errorDisplay, setErrorDisplay ] = useState("none");
  const [ errorMessage, setErrorMessage ] = useState("");

  useEffect(() => {
      setFiles(location.state.files);                 
  }, [])

  const handleUpdate = (e) => {
    setErrorDisplay("none");
    setSuccessDisplay("none");

    const { name, value } = e.target;

    if(value === "" || files[name] == value) {
      return
    }

    let params = {
      key: files.id,
      table: "upload",
      update: {
        [name]: value
      }
    }

    console.log(params);
    //update policy
    axios.put(config.host+"/policy/update", params, {
      header: {
        "Content-Type": "application/json"
      }
    })
    .then(result => {
      files["status"] = value
      setSuccessDisplay("block")
      setSuccessMessage("Update Successful.")
    })
    .catch(error => {
      setErrorDisplay("block")
      setErrorMessage("Something went wrong. Please try again or contact the Technical Support.")
    })
  }

  return(
    <div className="container">
      <div className="text-center border-bottom">
        <h3>{ files.name }</h3>
      </div>
      <div className="border border-success rounded text-center pt-3 mx-5 my-3" style={{ display: successDisplay }}>
        <p className="text-success" style={{ whiteSpace: "pre-wrap" }}>{ successMessage }</p>
      </div>
      <div className="border border-danger rounded text-center pt-3 mx-5 my-3" style={{ display: errorDisplay }}>
        <p className="text-danger">{ errorMessage }</p>
      </div>
        <div className="row pt-4 mx-5 text-center"></div>
        <div className="row pt-1">
          <div className="col-md-2 text-left">
            IC No. :
          </div>
          <div className="col-md-6 text-left">
            { files.holder_id }
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-md-2 text-left">
            File Name :
          </div>
          <div className="col-md-6 text-left">
            { files.file_name }
          </div>
        </div>
        <div className="row pt-1">
          <div className="col-md-2 text-left">
            Status :
          </div>
          <div className="col-md-2 text-left">
          { 
                !statusEditable ?
                files.status == 0 ? "Not Processed":"Processed" :
                <select
                  autoFocus
                  name="status"
                  className="custom-select" 
                  defaultValue={ files.status }
                  onBlur={ (e) => { setStatusEditable(false); handleUpdate(e) } }
                >
                  <option value="-" disabled>Status...</option>
                  <option value="0">Not Processed</option>
                  <option value="1">Processed</option>
                </select>
            }
          </div>
          <div className="col-md-2">
              <i className="fas fa-pen" style={{ cursor: "pointer" }} onClick={ () => setStatusEditable(true) }></i>
            </div>
        </div>
        <div className="row pt-4 mx-5 text-center"></div>
        <div className="row mx-6">
        <div className="col">
          <h5>Note:</h5>
        </div>
      </div>
        <div className="row mx-6">
        <div className="col">
          <form>
            <div className="form-group">
              {
                typeof files.note !== "undefined" &&
                <textarea
                  name="note"
                  className="form-control"
                  rows="8"
                  maxLength="256"
                  defaultValue={ files.note }
                  onBlur={ (e) => handleUpdate(e) }
                >
                </textarea>
              }
            </div>
          </form>
        </div>
      </div>
    </div>  
  )
}

export default UploadView;