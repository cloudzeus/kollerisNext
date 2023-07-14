
import React, { useState, useRef } from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';

export default function FormSteps({activeIndex, setActiveIndex}) {
  
    const toast = useRef(null);
    const items = [
        {
            label: 'Πληροφορίες',
            command: (event) => {
                
            }
        },
        {
            label: 'Μετάφραση',
            command: (event) => {
               
            }
        },
       
      
    ];

    return (
        <div className="card mt-5 mb-5">
            <Toast ref={toast}></Toast>
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
        </div>
    )
}
        