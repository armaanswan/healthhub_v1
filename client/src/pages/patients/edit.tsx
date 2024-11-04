import { Edit, ListButton, RefreshButton, useForm } from "@refinedev/antd";
import { Button, Col, Form, Input, Row, Select, Switch } from "antd";
import { User } from "../../lib/api/schemas";
import { useGetIdentity } from "@refinedev/core";
import { USER_ROLE } from "../../authProvider";

export const PatientEdit = () => {
  const { data: user } = useGetIdentity<User>();
  const { formProps, saveButtonProps, query, formLoading } = useForm({});

  const isSameUser = user?.id === query?.data?.data.id;
  const role = localStorage.getItem(USER_ROLE) || "";

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      canDelete={!isSameUser}
      headerButtons={({ refreshButtonProps, listButtonProps }) => (
        <>
          {listButtonProps && !isSameUser && (
            <ListButton {...listButtonProps} meta={{ foo: "bar" }} />
          )}
          <RefreshButton {...refreshButtonProps} meta={{ foo: "bar" }} />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="First Name"
          name={["firstName"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Email"}
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {role === "Staff" && (
          <Form.Item label={"Account Status"} name={["isActive"]}>
            <Select
              options={[
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ]}
              style={{ width: 120 }}
            />
          </Form.Item>
        )}
      </Form>
    </Edit>
  );
};
