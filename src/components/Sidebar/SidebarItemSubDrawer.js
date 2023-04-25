export const SidebarItemSubDrawer = ({ onClick, icon, label }) => {
  const router = useRouter();
  const theme = useTheme()
  return (
      <StyledSpan onClick={onClick} theme={theme}>
        {icon}
        <SidebarText>{label}</SidebarText>
      </StyledSpan >
  );
};
