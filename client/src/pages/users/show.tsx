import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export const UserShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"First Name"}</Title>
      <TextField value={record?.firstName} />
      <Title level={5}>{"Last Name"}</Title>
      <TextField value={record?.lastName} />
      <Title level={5}>{"Email"}</Title>
      <TextField value={record?.email} />
      <Title level={5}>{"Phone Number"}</Title>
      <TextField value={record?.phoneNumber} />
      <Title level={5}>{"Date of Birth"}</Title>
      <TextField value={dayjs(record?.dateOfBirth).format("DD/MM/YYYY")} />
      <Title level={5}>{"Role"}</Title>
      <TextField value={record?.role} />
    </Show>
  );
};
