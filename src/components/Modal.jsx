// import { X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";

// const Modal = ({ isOpen, onClose, title, children }) => {
//   const [show, setShow] = useState(isOpen);

//   useEffect(() => {
//     if (isOpen) setShow(true);
//     else setTimeout(() => setShow(false), 300); // Wait for animation
//   }, [isOpen]);

//   if (!show) return null;

//   return createPortal(
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
//         isOpen ? "opacity-100" : "opacity-0"
//       }`}
//     >
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
//         onClick={onClose}
//       />

//       {/* Modal Content */}
//       <div
//         className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transform transition-all duration-300 ${
//           isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//           <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">{children}</div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default Modal;

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children, width, centered = false }) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
    else setTimeout(() => setShow(false), 300); // Wait for animation
  }, [isOpen]);

  if (!show) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex ${centered ? "items-center" : "items-start"} justify-center p-4 overflow-y-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-white rounded-[8px] shadow-2xl ${width} relative z-10 overflow-hidden transform transition-all duration-300 ${centered ? "" : "mt-10"} ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        {/* <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-20">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div> */}

        {/* Body */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 72px)" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
