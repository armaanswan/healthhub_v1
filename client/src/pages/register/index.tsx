import { ThemedTitleV2 } from "@refinedev/antd";
import { AuthPage } from "../../components/pages/auth";

export const Register = () => {
  return (
    <AuthPage
      type="register"
      title={
        <ThemedTitleV2
          text="HealthHub"
          // icon={<img src="https://refine.dev/img/logo.png" />}
          collapsed={false}
        />
      }
      // hideForm
      // contentProps={{
      //   style: {
      //     background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      //   },
      // }}
      // renderContent={(
      //   content: React.ReactNode,
      //   title: React.ReactNode // not return
      // ) => {
      //   return <p>hello</p>;
      // }}
    />
  );
};
