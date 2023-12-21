import { useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { OverlayPanel } from "primereact/overlaypanel"

const InfoPanel = ({message}) => {
    const op = useRef(null)
    return (
        <div>
            <Button type="button" icon="pi pi-info" className="bg-white" outlined onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op}>
                <div className="w-20rem text-lg">
                    <p>
                       {message}
                    </p>
                </div>
            </OverlayPanel>
        </div>
    )
}

export default InfoPanel;