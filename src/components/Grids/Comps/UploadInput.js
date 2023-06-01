import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from "styled-components";
import { InputContainer } from '@/components/Forms/FormInput';
const UploadInput = ({title, selectedFile, setSelectedFile}) => {

    const handleFileChange = () => {
        let fileEl = document.getElementById('customFileUpload');
        let file = fileEl.files[0];
        let files = fileEl.files;
        console.log(files);
        setSelectedFile(file);

      };

      const handleClick = (e) => {
        e.preventDefault()
      
        document.getElementById('customFileUpload').click()
      }

     

    return (
       
        <UploadInputContainer id="uploadFileID" >
                <p>{`Ανέβασμα ${title}`}</p>
                <input 
                    type="file" 
                    multiple
                    id="customFileUpload"
                    onChange={handleFileChange}
                    />
                <div className="btn" onClick={handleClick}>
                    <span>{selectedFile ? selectedFile.name : '' }</span>
                </div>
                {/* <button onClick={handleClick}></button> */}
            <AddPhotoAlternateIcon  />
        </UploadInputContainer>
    )
}



const UploadInputContainer = styled.div`
    position: relative;
    height: 45px;
    border-bottom: 2px solid #b6b6b4;
    button {
        background-color: transparent;
        border: none;
        height: 100%;
        width: 100%
    }
    .btn {
        width: 100%;
        height: 40px;
        font-size: 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    input[type="file"] {
        display: none; 
    }
    span {
        font-size: 12px;
        position: absolute;
        left:2px;
        bottom: 5px;
    }

    svg {
        color: ${({theme}) => theme.palette.primary.main};
        transition: all 0.3s ease-in-out;
        position: absolute;
        right: 0px;
        bottom: -10px;
        transform: translateY(-50%);
    }
    svg:active {
        scale: 0.9;
    }
    p {
        font-size: 13px;
        letter-spacing: 0.7px;
        font-weight: 400;
        color:  #b6b6b4; 
    }

`

export default UploadInput

