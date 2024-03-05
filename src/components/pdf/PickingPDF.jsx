import { useRef, useState, useEffect } from 'react';
import Pdf from 'react-to-pdf';
import generatePDF from 'react-to-pdf';
import { usePDF } from 'react-to-pdf';



export default function MyDocument() {
	const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
   return (
      <div>
         <button onClick={() => toPDF()}>Download PDF</button>
         <div  ref={targetRef}>
            Content to be gewwnerated to PDF afadfadwdw
         </div>
      </div>
   )
}


