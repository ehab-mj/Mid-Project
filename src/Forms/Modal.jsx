import './css/Modal.css'

export default function Modal({ onClose, children }) {
    return (
        <div onMouseDown={onClose} className="modal-overlay">
            <div onMouseDown={(e) =>
                e.stopPropagation()
            }>
                {children}
            </div>
        </div>
    )
}
