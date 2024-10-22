import { Create, useForm } from "@refinedev/antd";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"First Name"}
          name="firstName"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Last Name"}
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

        <Form.Item
          label={"Password"}
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
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
                defaultValue={true}
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
