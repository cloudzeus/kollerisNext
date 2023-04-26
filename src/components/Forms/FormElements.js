import Link from 'next/link';
import CheckboxInput from './CheckboxInput';
import styled from 'styled-components';




export const CheckBoxRow = () => {
  return (
    <FlexRowJustify>
      <CheckboxInput label="ΑποΘή" />
    </FlexRowJustify>
  )
}


const FlexRowJustify = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`