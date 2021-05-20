import React, { useGlobal, useState, useEffect } from 'reactn';
import axios from 'axios';
import config from '../../config';

function Upload({ history }) {

  // Global State
  const [ agent, setAgent ] = useGlobal("agent")

  // Upload state
  const [ files, setFiles ] = useState([])
  const [ filterFiles, setFilterFiles ] = useState([])

  // Error
  const [ errorDisplay, setErrorDisplay ] = useState("none");
  const [ errorMessage, setErrorMessage ] = useState("");

  useEffect(() => {
    axios.get(config.host+"/upload/get", {
      params: {
        agent_id: agent.id
      }
    })
    .then(result => {
      setFiles(result.data)
      setFilterFiles(result.data)
    })
    .catch(error => {
      setErrorDisplay("block")
      setErrorMessage("Something went wrong. Please try again or contact the Technical Support.")
    })
  }, [])

  const handleCustomerSelect = (index, files) => {
    history.push(`/upload/${index}`, { files: files });
}

  const handleSearch = (name) => {
    let regex = new RegExp(name.toLowerCase(), "g");
    let fitleredFiles = files.filter(file => file.name.toLowerCase().match(regex))
    
    if(name === "")
      setFilterFiles(files);
    else  
      setFilterFiles(fitleredFiles);
  }

  return(
    <div className="container">
      <h3>File Management</h3>
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text"><i className="fas fa-search"></i></div>
            </div>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Customer Name..." 
              onChange={ (e) => handleSearch(e.target.value) }
            />
          </div>
        </div>
      </div>
      <div className="border border-danger rounded text-center pt-3 mx-5 my-3" style={{ display: errorDisplay }}>
        <p className="text-danger">{ errorMessage }</p>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Holder id.</th>
            <th scope="col">Name</th>
            <th scope="col">File Name</th>
            <th scope="col">Status</th>
            <th scope="col">Notes</th>
            <th scope="col">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {
            filterFiles.length === 0 && 
            (
              <tr>
                <td colSpan="7" className="text-center">There is no record.</td>
              </tr>
            )
          }
          {
            filterFiles.map((file, index) => {
              return(
                <tr key={ index } onClick={ () => handleCustomerSelect(index, file) } style={{ cursor: "pointer" }}>
                  <th scope="row" >{ file.holder_id }</th>
                  <td>{ file.name }</td>
                  <td>{ file.file_name }</td>
                  <td>{ file.status== 0 ? "Not Processed":"Processed" }</td>
                  <td>{ file.note == null? "No": "Yes" }</td>
                  <td>{ file.created_at }</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Upload;