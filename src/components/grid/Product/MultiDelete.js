import React from 'react'
import { Button } from 'primereact/button'

const MultiDelete = () => {
  return (
    <div>
          <Button label="Μαζική Διαγραφή" icon="pi pi-trash" className="p-button-danger w-full p-mr-2 mt-2" onClick={() => setShow(prev => !prev)} />
    </div>
  )
}

export default MultiDelete