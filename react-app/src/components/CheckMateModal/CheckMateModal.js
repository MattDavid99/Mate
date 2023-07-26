import React from "react"
import { useHistory } from "react-router-dom";
import "./CheckMateModal.css"

export default function CheckMateModal({ winner, onClose, onRematch }) {

  const history = useHistory();

  const handleClose = () => {
    onClose();
    history.push("/");
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1 className="modal-h1">{winner}</h1>
        <button className="modal-button" onClick={handleClose}>Close</button>
        <button className="modal-button" onClick={onRematch}>Rematch</button>
      </div>
    </div>
  );
}
