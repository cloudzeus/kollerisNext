import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/router';
import { NavigateArrowButton } from '@/componentsStyles/buttons/buttonStyles';


const NavigateBtn = ({ text, url }) => {
    const onClick = () => {
        router.push(url)
    }
    const router = useRouter();
    return (
        < NavigateArrowButton onClick={onClick} >
            <NavigateNextIcon />
            <span>{text}</span>
        </ NavigateArrowButton>
    )
}




export default NavigateBtn;