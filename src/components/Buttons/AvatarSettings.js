'use client';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider'
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import removeItemFromLocalStorage from '@/utils/localStorage';
import { useRouter } from 'next/router';
import { logoutUser } from '@/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const sx = {
    fontSize: '17px',
    color: 'primary.main'
}

const AvatarSettings = () => {
    const [show, setShow] = useState(false);
    const route = useRouter();
    const dispatch = useDispatch();

    const session = useSession();
    const user = session?.data?.user;
    const [name, setName] = useState('')
    const onClick = () => {
        setShow(!show)
    }

    const onPressLogout = () => {
        dispatch(logoutUser())
        route.push('/')
    }

    useEffect(() => {
        if (user) {
            setName(user.firstName)
        }
    }, [name])

    
    return (
        <Container>
            < div className='topDiv' onClick={onClick}>
                <Avatar
                    alt="Remy Sharp"
                    src='/static/imgs/avatar.jpg'
                    sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 35, height: 35 }}
                />
                {/* <SettingsIconStyled /> */}
            </ div >
            {show && (
                <div className='hiddenDropDown'>
                    <div className="hiddenTopDiv">
                        <p>
                            Γειά σου,
                            <span className='name'> {name? name : '<User>'}</span>
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

                        <button className="btn" onClick={() => signOut({callbackUrl: 'http://localhost:3000/auth/signin'})}>
                            <LogoutIcon sx={sx} />
                            <ButtonText >Aποσύνδεση</ButtonText>
                        </button>

                    </div>
                </div>
            )}

        </Container>

    )
}



const Container = styled.div`
    .topDiv {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: ${({ theme }) => theme.palette.primary.light};
        border-radius: 30px;
        /* min-width: 90px; */
        padding: 4px;
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



const SettingsIconStyled = styled(SettingsIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 20px;
  margin-right: 2px;
`





export default AvatarSettings