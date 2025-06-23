import React from "react";

interface AddDataModalProps {
  open: boolean;
  onClose: () => void;
  newData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const AddDataModal: React.FC<AddDataModalProps> = ({
  open,
  onClose,
  newData,
  handleInputChange,
  handleSave,
}) => {
  return (
    open && (
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Yeni Veri Ekle</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Ad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={newData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="start" className="form-label">
                  Start
                </label>
                <input
                  type="text"
                  id="start"
                  name="start"
                  className="form-control"
                  value={newData.start}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="min" className="form-label">
                  Min Değer
                </label>
                <input
                  type="number"
                  id="min"
                  name="min"
                  className="form-control"
                  value={newData.min}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="max" className="form-label">
                  Max Değer
                </label>
                <input
                  type="number"
                  id="max"
                  name="max"
                  className="form-control"
                  value={newData.max}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="wordLength" className="form-label">
                  Word Length
                </label>
                <input
                  type="text"
                  id="wordLength"
                  name="wordLength"
                  className="form-control"
                  value={newData.wordLength}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bit" className="form-label">
                  Bit
                </label>
                <input
                  type="text"
                  id="bit"
                  name="bit"
                  className="form-control"
                  value={newData.bit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddDataModal;
