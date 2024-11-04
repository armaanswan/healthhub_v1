import { Show, TextField, useModalForm } from "@refinedev/antd";
import { useGetIdentity, useShow } from "@refinedev/core";
import { Button, Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import { User } from "../../lib/api/schemas";
import { useEffect } from "react";
import { USER_ROLE } from "../../authProvider";

const { Title } = Typography;

export const PatientShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  const role = localStorage.getItem(USER_ROLE) || "";

  const { data: user } = useGetIdentity<User>();

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
  } = useModalForm({
    resource: "test-results",
    action: "create",
  });

  useEffect(() => {
    if (user?.id && record?.id) {
      createFormProps.form?.setFieldValue("patientId", record?.id);
      createFormProps.form?.setFieldValue("doctorId", user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, record?.id]);

  return (
    <>
      <Show
        isLoading={isLoading}
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            {role === "Doctor" && (
              <Button type="primary" onClick={() => createModalShow()}>
                Make Prescription
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
      </Show>
      <Modal {...createModalProps} title="Make Prescription">
        <Form {...createFormProps} layout="vertical">
          <Form.Item label="Doctor" name="doctorId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Patient" name="patientId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Exam Type"
            name="examType"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "BGL",
                  label: "Blood Glucose Level (mg/dL)",
                },
                {
                  value: "BP",
                  label: "Blood Pressure (mmHg)",
                },
                { value: "BT", label: "Body Temperature (°C)" },
                { value: "CL", label: "Cholesterol Level (mg/dL)" },
                { value: "BMI", label: "Body Mass Index (kg/m²)" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
