export const IconBtn = styled.button`
	border: none;
	padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${props => props.theme.palette.primary.light};
		border-radius: 5px;
		color: white;
		font-size: 12px;
		margin-right: 10px;
		cursor: pointer;
		transition: transform 0.3s, background-color 0.3s;
		box-shadow: rgba(0, 0, 0, 0.10) 0px 1px 2px;
		&:active {
			transform: scale(0.8);
			background-color: ${props => props.theme.palette.primary.light50};
			border-radius: 8px;
		}
`