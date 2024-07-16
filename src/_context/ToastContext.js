import { useContext, createContext, useRef } from "react";
import { Toast } from "primereact/toast";
//CREATE TOAST CONTAINER:
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showMessage = ({severity, summary, message, life=4000} ) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: message,
      life: life,
    });
  };

  return (
    <ToastContext.Provider value={{ showMessage }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
