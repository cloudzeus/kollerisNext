import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Button } from "@react-email/button";
import { useTheme } from "@mui/material";


export default function WelcomeEmail({user}) {

    const button = {
        backgroundColor: "#2090ED",
        color: 'white',
        padding: "10px 20px",

        
    }
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Γειά σου!</Text>
          <Text style={heading}>{user.userName}</Text>
        </Container>
        <Button style={button}  href="https://example.com">Συνδέση!</Button>
      </Section>
    </Html>
  );
}



   


// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  display: "flex",
  aligItems: 'center',
};

const heading = {
  fontSize: "20px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

