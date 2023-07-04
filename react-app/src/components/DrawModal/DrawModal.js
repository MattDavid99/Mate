import React from "react"
import "./DrawModal.css"

export default function DrawModal({ onClose }) {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1 className="modal-h1">Draw</h1>
        <button className="modal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
