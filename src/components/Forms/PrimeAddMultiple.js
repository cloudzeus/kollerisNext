import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { useEffect } from "react";


export const AddMoreInput = ({ setFormData, formData, label, mb, mt }) => {
    useEffect(() => {
        if(formData.length === 0) {
            setFormData([
                {
                    name: '',
                    videoUrl: ''
                }
            ])
        }
    }, [formData, setFormData])

    const handleNameChange = (event, index) => {
        const updatedVideoList = [...formData];
        updatedVideoList[index] = {
            ...updatedVideoList[index],
            name: event.target.value
        };
        setFormData(updatedVideoList);
    };


    const handleVideoUrlChange = (event, index) => {
        const updatedVideoList = [...formData];
        updatedVideoList[index] = {
            ...updatedVideoList[index],
            videoUrl: event.target.value
        };
        setFormData(updatedVideoList);
    };



    const addVideo = (e) => {
        e.preventDefault();
        setFormData(prevList => [
            ...prevList,
            {
                name: '',
                videoUrl: ''
            }
        ]);
    };
    const deleteInputFields = (e, index) => {
        e.preventDefault();
        const updatedList = [...formData];
        updatedList.splice(index, 1);
        setFormData(updatedList);
    };

    return (
           <div>
             <label>
                {label}
            </label>
            <div className="content">
                {formData.map((video, index) => (
                    <div key={index} className="add_more_double_input_div">
                        {index > 0 ? (
                            <p className="mb-1 font-medium">Βίντεο {index} </p>
                        ): null}
                        <InputText
                            type="text"
                            className="custom_input mb-2"
                            value={video.name}
                            onChange={event => handleNameChange(event, index)}
                            placeholder="Ονομα:"

                        />
                        <InputText
                            type="text"
                            className="custom_input mb-2"
                            value={video.videoUrl}
                            onChange={event => handleVideoUrlChange(event, index)}
                            placeholder="https://"
                        />
                       
                        <div className="delete_row_button">
                        {index !== 0 && (
                             <div className="inline-flex">
                                  <Button 
                                size="small" 
                                label="Διαγραφή"
                                 className="add_more_btn mb-1"
                                severity="danger" 
                                aria-label="Cancel" 
                                onClick={(e) => deleteInputFields(e, index)} 
                                />
                             </div>
                           
                        )}
                        </div>
                    </div>
                ))}
                <div className="inline-flex">
                    <Button
                        className="add_more_btn"
                        size="small"
                        severity="secondary"
                        onClick={addVideo}
                        label="Προσθηκη" />
                </div>

            </div>
           </div>


    )
}



