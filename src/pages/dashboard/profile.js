import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { HeaderBox, HeaderBoxShadow } from '@/components/HeaderBox';
import { Avatar } from '@mui/material';
import { Btn } from '@/components/Buttons/styles';
import styled from 'styled-components';
const Profile = () => {
  return (
    <AdminLayout >
      <HeaderBox title={'Profile'}>
        {/* LEFT SIDE */}
        <HeaderBoxShadow title={'Eικόνα Προφίλ'}>
          <DivStyled>
            <Avatar
              alt="Remy Sharp"
              src='/static/imgs/avatar.jpg'
              sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 100, height: 100 }}
            />
            <p>Αλλάξτε την Εικόνα Προφίλ σας</p>
            <Btn className="btn"> Αλλαγή Avatar</Btn>
          </DivStyled>
        </HeaderBoxShadow>
        {/* RIGHT SIDE */}
        <HeaderBoxShadow title={'Αλλαγή Πληροφοριών Προφίλ'}>
          <DivStyled>
            <Avatar
              alt="Remy Sharp"
              src='/static/imgs/avatar.jpg'
              sx={{ bgcolor: 'triadic.light', color: 'triadic.main', fontSize: '10px', width: 100, height: 100 }}
            />
            <p>Αλλάξτε την Εικόνα Προφίλ σας</p>
            <Btn className="btn"> Αλλαγή Avatar</Btn>
          </DivStyled>
        </HeaderBoxShadow>
      </HeaderBox>
    </AdminLayout>
  )
}

const DivStyled = styled.div`
  min-width: 350px;
  p {
    margin-top: 10px;
    font-size: 13px;
  }
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .btn {
    max-width: 130px;
    min-height: 40px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
`

export default Profile