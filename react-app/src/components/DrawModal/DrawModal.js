import React from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./DrawModal.css"

export default function DrawModal({ onClose }) {
  const history = useHistory();

  const handleClose = () => {
    onClose();
    history.push("/");
  };

  const handleRematch = () => {
    window.alert("Feature coming soon!")
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1 className="modal-h1">Draw</h1>
        <div className="modal-button-container">
          <button className="modal-button" onClick={handleClose}>Close</button>
          <button className="modal-button" onClick={handleRematch}>Rematch</button>
        </div>
      </div>
    </div>
  );
}
