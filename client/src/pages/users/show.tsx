import { Show, TextField, useModal } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Modal, Select, Typography } from "antd";
import dayjs from "dayjs";
import { USER_ROLE } from "../../authProvider";

const { Title } = Typography;

export const UserShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const role = localStorage.getItem(USER_ROLE) || "";

  const record = data?.data;

  const { show, modalProps } = useModal();

  return (
    <>
    
    <Show isLoading={isLoading}
    
    headerButtons={({ defaultButtons }) => (
      <>
        {defaultButtons}
        
        {role === "Admin" && (
          <Button type="primary" onClick={() => show()}>
            Generate Report
          </Button>
        )}
      </>
    )}
    >
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
      <Modal {...modalProps}>
        
      </Modal>
    </>
  );
};
