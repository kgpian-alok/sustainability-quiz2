import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const confirmButtonColor =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-sky-500 hover:bg-sky-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`bg-slate-800 rounded-xl shadow-2xl w-full max-w-md relative transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
            <AlertTriangle
              className="h-6 w-6 text-red-400"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-bold text-white" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-400">{message}</p>
          </div>
        </div>
        <div className="bg-slate-700/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4">
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm transition-colors ${confirmButtonColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
