import React from "react"
import { useHistory } from "react-router-dom";
import "./CheckMateModal.css"

export default function CheckMateModal({ winner, onClose, onRematch }) {

  const history = useHistory();

  const handleClose = () => {
    onClose();
    history.push("/");
  };
  const handleRematch = () => {
    window.alert("Feature coming soon!")
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1 className="modal-h1">{winner}</h1>
        <div className="modal-button-container">
          <button className="modal-button" onClick={handleClose}>Close</button>
          <button className="modal-button" onClick={handleRematch}>Rematch</button>
        </div>
      </div>
    </div>
  );
}
