import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { Card, theme, Typography } from "antd";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

export const layoutStyles: CSSProperties = {};

export const containerStyles: CSSProperties = {
  maxWidth: "400px",
  margin: "auto",
  padding: "32px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};

export const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

export const bodyStyles: CSSProperties = { padding: 0, marginTop: "32px" };

export const titleStyles: CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 700,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};

export default function RegisterPatient() {
  const { token } = theme.useToken();

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      Patient Account Created Successfully!
    </Typography.Title>
  );

  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2
          text="HealthHub"
          // icon={<img src="https://refine.dev/img/logo.png" />}
          collapsed={false}
        />
      }
      renderContent={(content, title) => (
        <>
          {title}
          {/* {content} */}
          <Card
            title={CardTitle}
            headStyle={headStyles}
            bodyStyle={bodyStyles}
            style={{
              ...containerStyles,
              backgroundColor: token.colorBgElevated,
            }}
          >
            <Typography.Text>
              Thank you for creating an account with HealthHub! Your account is now being reviewed.
            </Typography.Text>
            <br /> <br />
            <Typography.Text>
              Please note that an administrator will review your registration, and you will not be able to access the system until it has been approved.
            </Typography.Text>
            <br /> <br />
            <Typography.Text>
              We appreciate your patience during this process.
            </Typography.Text>
          </Card>
        </>
      )}
    />
  );
}
