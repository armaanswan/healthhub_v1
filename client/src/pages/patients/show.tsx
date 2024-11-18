import { Show, TextField, useModalForm } from "@refinedev/antd";
import { useGetIdentity, useList, useMany, useShow } from "@refinedev/core";
import { Button, Col, Form, Input, Modal, Row, Select, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { User } from "../../lib/api/schemas";
import { useEffect } from "react";
import { USER_ROLE } from "../../authProvider";

const { Title } = Typography;

const medicalTestOptions = [
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
] ;

export const PatientShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  const role = localStorage.getItem(USER_ROLE) || "";

  const { data: user } = useGetIdentity<User>();
  const { data: monitorings } = useList({
    resource: "monitoring",
    queryOptions: {
      enabled: !!record?.id && !!user?.id,
    },
    filters: [
      {
        field: "patientId",
        operator: "eq",
        value: record?.id,
      },
      {
        field: "doctorId", 
        operator: "eq",
        value: user?.id,
      }
    ],
  });



  const {
    modalProps: prescriptionModalProps,
    formProps: prescriptionFormProps,
    show: prescriptionModalShow,
  } = useModalForm({
    resource: "test-results",
    action: "create",
  });

  const {
    modalProps: monitoringModalProps,
    formProps: monitoringFormProps,
    show: monitoringModalShow,
  } = useModalForm({
    resource: "monitoring",
    action: "create",
  });

  useEffect(() => {
    if (user?.id && record?.id) {
      prescriptionFormProps.form?.setFieldValue("patientId", record?.id);
      prescriptionFormProps.form?.setFieldValue("doctorId", user?.id);
      monitoringFormProps.form?.setFieldValue("patientId", record?.id);
      monitoringFormProps.form?.setFieldValue("doctorId", user?.id);
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
              <>
                <Button onClick={() => monitoringModalShow()}>Setup Monitoring</Button>
                <Button type="primary" onClick={() => prescriptionModalShow()}>
                  Make Prescription
                </Button>
              </>
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

        {monitorings?.data && monitorings.data.length > 0 && (
          <>
            <Title level={5}>{"Monitorings"}</Title>
            {monitorings.data.map((monitoring) => (
              <Tag key={monitoring.id} style={{ marginRight: "8px", marginBottom: "8px" }}>
                {monitoring.monitoredFunction}
              </Tag>
            ))}
          </>
        )}
      </Show>
      <Modal {...prescriptionModalProps} title="Make Prescription">
        <Form {...prescriptionFormProps} layout="vertical">
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
            <Select options={medicalTestOptions} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal {...monitoringModalProps} title="Setup Monitoring">
        <Form {...monitoringFormProps} layout="vertical">
          <Form.Item label="Doctor" name="doctorId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Patient" name="patientId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Monitored Function"
            name="monitoredFunction"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={medicalTestOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
