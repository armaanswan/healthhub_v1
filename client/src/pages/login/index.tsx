import { ThemedTitleV2 } from "@refinedev/antd";
import { Link } from "react-router-dom";
import { AuthPage } from "../../components/pages/auth";

export const Login = () => {
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
      registerLink={
        <div
          style={{
            marginTop: 5,
            padding: 5,
          }}
        >
          If you don't have an account, you can <br />
          <Link to="/register">
            <b>create a new patient account</b>
          </Link>
        </div>
      }
    />
  );
};
