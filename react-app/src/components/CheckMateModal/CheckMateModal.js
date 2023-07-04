import React from "react"
import "./CheckMateModal.css"

export default function CheckMateModal({ winner, onClose }) {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1 className="modal-h1">{winner}</h1>
        <button className="modal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
