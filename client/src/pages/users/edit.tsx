import { Edit, ListButton, RefreshButton, useForm } from "@refinedev/antd";
import { Button, Col, Form, Input, Row, Select, Switch } from "antd";
import { User } from "../../lib/api/schemas";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

export const UserEdit = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<User>();
  const { formProps, saveButtonProps, query, formLoading } = useForm({
    redirect: false,
    onMutationSuccess: () => {
      if (user?.id !== query?.data?.data.id) navigate("/users");
    },
  });
  const isSameUser = user?.id === query?.data?.data.id;

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
        {!isSameUser && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={"Role"}
                name={["role"]}
                initialValue={"Staff"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={"draft"}
                  options={[
                    { value: "Patient", label: "Patient" },
                    { value: "Doctor", label: "Doctor" },
                    { value: "Staff", label: "Staff" },
                    { value: "Admin", label: "Admin" },
                  ]}
                  style={{ width: 120 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={"Account Status"} name={["isActive"]}>
                <Select
                  options={[
                    { value: true, label: "Active" },
                    { value: false, label: "Inactive" },
                  ]}
                  style={{ width: 120 }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Edit>
  );
};
