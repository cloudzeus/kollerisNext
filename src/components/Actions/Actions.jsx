import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
export const Actions = ({ onEdit, children, label="Τροποποίηση" }) => {
  const actionsRef = useRef(null);

  return (
    <>
      <div
        onClick={(e) => actionsRef.current.toggle(e)}
        className="flex align-items-center justify-content-center w-full h-full cursor-pointer"
      >
        <i className=" pi pi-cog" style={{ color: "var(--primary-color)", fontSize: '13px' }}></i>
      </div>
      <OverlayPanel ref={actionsRef}>
        <div className="actions_overlay ">
        <Button label={label} icon="pi pi-pencil" className='w-full' onClick={onEdit} />
          {children}
        </div>
      </OverlayPanel>
    </>
  );
};
