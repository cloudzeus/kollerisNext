import AdminLayout from '@/layouts/Admin/AdminLayout'
import CircularProg from '@/components/CircularProgress';
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import { Pagination } from '@mui/material';
import usePagination from '@/utils/pagination';
import Button from '@/components/Buttons/Button';
import { findSoftoneAndSyncTables } from '@/features/grid/gridSlice';

const percentage = 90;

const SyncItems = () => {
  const dispatch = useDispatch();
  const { notFoundData } = useSelector(state => state.grid);
  const [dataUpdate, setDataUpdate] = useState([]);
  const { currentPage, totalPages, paginatedData, handlePageChange, } = usePagination(notFoundData, 10);



  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([{}]);
  console.log(selected)


  const handleAdd = async () => {
    let { data } = await axios.post('/api/admin/markes/markes', { action: 'createMany', data: dataUpdate })
  }
  const handleItemClick = (index, item) => {
    console.log(item)
    if (selected.includes(index)) {
      setDataUpdate(dataUpdate.filter((id) => id !== item));
      setSelected(selected.filter((id) => id !== index));
    } else {
      setDataUpdate((prevData) => [...prevData, item]);
      setSelected([...selected, index]);
    }
  };

  const findExtraSoftone = async () => {
    dispatch(findSoftoneAndSyncTables())
  }

  useEffect(() => {
    findExtraSoftone();
  }, [])

  return (
    <AdminLayout>
      <Section>
        <Box>
          <FlexBorderBottom  >
            <div className="header">
              <h2 className="boxHeader">Μάρκες</h2>
            </div>
            <div className="prog-div" >
              <CircularProg color={'#ff9000'} value={66} />
            </div>
          </FlexBorderBottom >
          <button onClick={() => setSelectAll(prev => !prev)}>select all</button>
          <p>Εγγραφές που υπάρχουν στο Softone και λείπουν από το Ariadne</p>
          <div>

          </div>
          {paginatedData.map((item, index) => (
            <div
              key={index}
              className="formsContainer"
              onClick={() => handleItemClick(index, item)}>
              <div className="info-div">
                <span>MTRMARK:</span>
                <p>{item.MTRMARK}</p>
                <span>ΟΝΟΜΑ:</span>
                <p>{item.NAME}</p>
              </div>

              {/* <button onClick={handleAdd}>Add</button> */}
              <div className="check-div">
                {selected.includes(index) && <CheckIcon />}
                {selectAll && <CheckIcon />}
              </div>
            </div>
          ))}
          <Button onClick={handleAdd} >Προσθήκη</Button>
          <Pagination
            count={totalPages}
            shape="rounded"
            onChange={handlePageChange}
            page={currentPage}
          />
        </Box>

      </Section>
    </AdminLayout>
  )
}

const Section = styled.section`
    .border-div  {
        border-bottom: 2px solid ${props => props.theme.palette.background};
    }

    .top-div {
        padding: 10px;
        align-items: center;
        justify-content: space-evenly;
    }
    .data-to-sync {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 10px;
    }
    
    .info-div {
        display: flex;
        align-items: center;
        justify-content: center;
        & p {
            font-weight: 600;
            margin-right: 10px;
        }
        & * {
            margin-right: 2px;
        }
    }

    .check-div {
        padding: 5px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${props => props.theme.palette.border};
        & svg {
            font-size: 18px;
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
    .formsContainer {
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        position: relative;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
    }

    .formsContainer:hover {
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
    }

  

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 50px;
        grid-column-gap:  10px;
        box-shadow: rgba(99, 99, 99, 0.05) 0px 1px 5px 0px;
    }

    .synced {
        display: none;
    }
    .formsContainer h2 {
        font-size: 12px;
        letter-spacing: 0.2px;
  
    }

    .formsContainer span.input {
        font-size: 13px;
        align-items: center;
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        padding-left: 20px;
        border-radius: 5px;
        color: grey;
    }
   
  
    .sync-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: ${props => props.theme.palette.primary.main};
        /* background-color:#e4ac1b; */
        border-radius: 5px;
        border: none;
        outline: none;
        width: auto;
        color: white;
        padding: 10px 2px;
        margin-left: 10px;
        
    }
    .sync-button svg {
        color: white;
        font-size: 20px;
    }
    .item-primary-key {
        margin-bottom: 10px;
        span {
            font-size: 11px;
          
        }
        span:nth-child(2) {
            font-weight: 600;
            margin-left: 5px;
        }
    }

    .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .prog-div {
        width: 80px;
        height: 80px;

    }
`


const FlexBorderBottom = styled.div`
    border-bottom: 1px solid ${props => props.theme.palette.background};

`

const Box = styled.div`
    margin-bottom: 20px;
    background-color: white;
    border-radius: 5px;     
        /* box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; */
        box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        padding: ${props => props.p ? props.p : '20px'};
        height: auto; 
`

export default SyncItems