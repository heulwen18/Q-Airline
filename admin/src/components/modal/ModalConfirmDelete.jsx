import React from "react";
import './modalConfirmDelete.scss';

const ModalConfirmDelete = ({ show, onClose, onConfirm, entity }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">Confirm Delete</div>
        <div className="modal-body">
          Are you sure you want to delete this {entity}?
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
