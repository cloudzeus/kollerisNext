import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import Image from 'next/image';

const ChangeLogo  = ({data}) => {
    return (
        <Container>
            <EditLogo>
             <Image 
                src={'/uploads/' + data.logo}
                alt={'logo'}
                width={100}
                height={100}
                />
                <Button icon="pi pi-camera"  rounded severity="secondary" aria-label="Search" />
        </EditLogo>
        </Container>
    )
}


const Container = styled.div`
      position: relative;
      width: 100px;
    height: 100px;
`

const EditLogo = styled.div`
  
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 0 1px #e8e8e8;
   
`


export default ChangeLogo;