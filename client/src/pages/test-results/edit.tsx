import { Edit, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";

export const TestResultEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({});

  const { selectProps: patientSelectProps } = useSelect({
    resource: "users",
    optionLabel: "fullName",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "Patient",
      },
    ],
  });

  const { selectProps: doctorSelectProps } = useSelect({
    resource: "users",
    optionLabel: "fullName",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "Doctor",
      },
    ],
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Doctor"
          name="doctorId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...doctorSelectProps} />
        </Form.Item>
        <Form.Item
          label="Patient"
          name="patientId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...patientSelectProps} />
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
        <Form.Item
          label="Exam Result"
          name="result"
          getValueFromEvent={(e) => parseInt(e.target.value)}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Exam Date"
          name="createdDate"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : "",
          })}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Edit>
  );
};
