'use client';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut } from 'next-auth/react';
import { logoutUser } from '@/features/userSlice';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Btn } from './Button';


const sx = {
    fontSize: '17px',
    color: 'primary.main'
}

const filterName = (name) => {
    if(name.length > 10){
        return name.slice(0, 10) + '...'
    } else {
        return name;
    }
}



const AvatarSettings = () => {
    const [show, setShow] = useState(false);
    const route = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)

    const [name, setName] = useState('')
    const onClick = () => {
        setShow(!show)
    }


    const onPressLogout = () => {
        signOut({
            redirect: false
        })

        route.push('/auth/signin')
        dispatch(logoutUser())
    }

    //load name on the welcome bar:
    useEffect(() => {
        if (user) {
            setName(user.firstName)
        }
    }, [name])

   
    return (
        <Container>
            < AvatarBtn onClick={onClick}>
                <Avatar
                    alt="Remy Sharp"
                    src='/static/imgs/avatar.jpg'
                    sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 35, height: 35 }}
                />
                <div>
                    <p>
                        {filterName(user?.firstName)}
                    </p>
                    <SettingsIconStyled />
                </div>
            </AvatarBtn >
            {show && (
                <div className='hiddenDropDown'>
                    <div className="hiddenTopDiv">
                        <p>
                            Γειά σου,
                            <span className='name'> {name ? name : '<User>'}</span>
                        </p>
                    </div>
                    <div className="hiddenBottomDiv">
                        <button className="btn" onClick={() => route.push('/dashboard/profile')}>
                            <AccountCircleIcon sx={sx} />
                            <ButtonText >Προφίλ</ButtonText>
                        </button>
                        <button className="btn">
                            <SettingsIcon sx={sx} />
                            <ButtonText >Ρυθμίσεις</ButtonText>
                        </button>

                        <button className="btn" onClick={onPressLogout}>
                            <LogoutIcon sx={sx} />
                            <ButtonText >Aποσύνδεση</ButtonText>
                        </button>

                    </div>
                </div>
            )}

        </Container>

    )
}

const AvatarBtn = styled(Btn)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.palette.primary.light60};
    border-radius: 30px;
    padding: 4px;   
    background-color: white;
    border: 1px solid ${({ theme }) => theme.palette.primary.light50};
    height: auto;
    width: auto;
    min-width: 125px;
    transition: transform 0.3s, background-color 0.3s;
	box-shadow: rgba(0, 0, 0, 0.10) 0px 1px 2px;
	&:active {
		transform: scale(0.9);
		background-color: ${props => props.theme.palette.primary.light50};
	}
    div {
        display: flex;
        align-items: center;
    }
    div p {
        margin-right: 2px;
        font-weight: 500;
    }

`


const Container = styled.div`

   
    p {
        margin-left: 4px;
    }
    p span {
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
    }
    .hiddenDropDown {
        border-top: 2px solid ${({ theme }) => theme.palette.primary.light};
        position: absolute;
        top: 80px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
        background-color: white;
        border-radius: 4px;
        min-width: 200px;
        right: 10px;
    }

    .hiddenTopDiv {
        border-bottom: 1px solid #f5f5f5;
        padding: 10px;
    }
    .hiddenTopDiv p {
        font-size: 14px;
        font-weight: 300;
    }
    .hiddenBottomDiv {
        padding: 10px;
    }
    .btn {
        display: flex;
        align-items: center;
        margin-bottom: ${props => props.mb ? `${props.mg}px` : '0px'};
        margin-top: ${props => props.mt ? `${props.mg}px` : '0px'};
        height: 40px;
        border-radius: 4px;
        padding-left: 10px;
        outline: none;
        border: none;
        background-color: transparent;
        width: 100%;
        cursor: pointer;
        &:hover {
            background-color: #f5f5f5;
            font-weight: 500;
        }
    }
    .name {
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
    }
    
`






const ButtonText = styled.p`
  margin-left: 10px;
  font-size: 14px;
`



const SettingsIconStyled = styled(KeyboardArrowDownIcon)`
  color: ${({ theme }) => theme.palette.accent};
  font-size: 20px;
  margin-right: 2px;
`





export default AvatarSettings