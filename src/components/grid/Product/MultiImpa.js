import React from 'react'
import { Button } from 'primereact/button'


const MultiImpa = () => {
  return (
    <div>
          <Button label="Αλλαγή Impa" icon="pi pi-arrow-down-right" className="surface-ground text-primary w-full p-mr-2 mt-2" onClick={() => setShow(prev => !prev)} />
    </div>
  )
}

export default MultiImpa