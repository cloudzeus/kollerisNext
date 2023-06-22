
import ActiveTag from "../ActiveTag";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
const ListHeader = ({ item, expand, index, setExpand, setShowNested, setSelectedItem}) => {
    
  

    const handleExpand = (index) => {
        if (expand.includes(index)) {
            setExpand([])
            return;
        }
        setExpand([index])
        setShowNested(false)
        setSelectedItem(item)
    }

    return (
        <div className='list-header-div' onClick={() => handleExpand(index)} >
            <div className="list-header-div-left">
                <div >
                    <span>Ονομα:</span>
                    <span>{item.categoryName}</span>
                </div>
                <div>
                    <ActiveTag isActive={true} />
                </div>
            </div>
            <div className="list-header-div-rigth">
                {!expand.includes(index) ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </div>
        </div>
    )
}

export default ListHeader;