import { Create, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Input, Select } from "antd";

export const TestResultCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  // const { selectProps: categorySelectProps } = useSelect({
  //   resource: "categories",
  // });

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
    <Create saveButtonProps={saveButtonProps}>
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
          name="examDate"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        {/* <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Content"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Category"}
          name={["category", "id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Status"}
          name={["status"]}
          initialValue={"draft"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"draft"}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "rejected", label: "Rejected" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item> */}
      </Form>
    </Create>
  );
};
