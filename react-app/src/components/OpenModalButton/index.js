import React from 'react';
import { useModal } from '../../context/Modal';
import "./OpenModalButton.css"

function OpenModalButton({
  modalComponent, 
  buttonText, 
  onButtonClick, 
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };

  return (
    <button onClick={onClick} className='open-modal-buttons'>{buttonText}</button>
  );
}

export default OpenModalButton;
