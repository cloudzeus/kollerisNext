import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const CircularProg = ({color, value}) => {
    return (
        <CircularProgressbar 
        value={value} 
        text={`${value}%`} 
        backgroundPadding={2}
        strokeWidth={10}
        styles={buildStyles({
          // Rotation of path and trail, in number of turns (0-1)
          rotation: 0.25,
          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: 'round',
          // Text size
          textSize: '20px',
          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.5,
          // Can specify path transition in more detail, or remove it entirely
          // pathTransition: 'none',
          // Colors
          pathColor: color,
          textColor: color,
          trailColor: '#eeeeee',
          backgroundColor: '#eeeeee',
          
        })}
        />
    )
}

export default CircularProg;