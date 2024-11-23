import { Show, TextField, useModal } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Modal, Select, Typography, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { USER_ROLE } from "../../authProvider";
import { apiClient } from "../../dataProvider";

const { Title } = Typography;

// Define types for better type safety
type CsvRow = Record<string, any>;
type CsvHeaders = Array<{
  label: string;
  key: keyof CsvRow;
}>;

const downloadCsv = (
  data: CsvRow[], 
  filename: string,
  headers: CsvHeaders
) => {
  // Convert data to CSV string
  const csvContent = [
    // Map header labels for the first row
    headers.map(header => header.label),
    // Map data using header keys
    ...data.map(row => 
      headers.map(header => row[header.key])
    )
  ].map(row => row.join(',')).join('\n');

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const UserShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const role = localStorage.getItem(USER_ROLE) || "";

  const record = data?.data;

  const { show, modalProps } = useModal();

  const [form] = Form.useForm();

  const handleGenerateReport = async (values: any) => {
    console.log("Generate report with values:", values);
    
    const patientId = record?.id;
    const date = dayjs(values.date);
    
    let endpoint = '';
    if (values.reportType === 'monthly') {
      const month = date.format('MM');
      endpoint = `test-results/report/${patientId}/month/${month}`;
    } else {
      const year = date.format('YYYY');
      endpoint = `test-results/report/${patientId}/year/${year}`;
    }

    try {
      const response = await apiClient.get(endpoint);
      const responseData = response.data.data;
      
      // Handle different response shapes based on isPrediction flag
      const headers: CsvHeaders = responseData.isPrediction ? [
        { label: 'Predicted Date', key: 'predictedDate' },
        { label: 'Exam Type', key: 'examType' },
        { label: 'Predicted Result', key: 'result' },
        { label: 'Abnormal', key: 'isAbnormal' },
        { label: 'Confidence', key: 'confidence' }
      ] : [
        { label: 'Date', key: 'createdDate' },
        { label: 'Patient Name', key: 'patientId.fullName' },
        { label: 'Exam Type', key: 'examType' },
        { label: 'Result', key: 'result' },
        { label: 'Abnormal', key: 'isAbnormal' },
        { label: 'Status', key: 'isReady' }
      ];

      console.log(responseData)

      // Transform the data based on response type
      const transformedData = responseData.isPrediction ? 
        responseData.data.map((item: any) => ({
          predictedDate: dayjs(item.predictedDate).format('YYYY-MM-DD HH:mm'),
          examType: item.examType,
          result: item.result,
          isAbnormal: item.isAbnormal ? 'Yes' : 'No',
          confidence: responseData.confidence
        })) :
        responseData.testResults.map((item: any) => ({
          createdDate: dayjs(item.createdDate).format('YYYY-MM-DD HH:mm'),
          'patientId.fullName': item.patientId.fullName,
          examType: item.examType,
          result: item.result,
          isAbnormal: item.isAbnormal ? 'Yes' : 'No',
          isReady: item.isReady ? 'Ready' : 'Pending'
        }));

      const filename = responseData.isPrediction ? 
        `predicted_medical_report_${record?.id}_${dayjs().format('YYYYMMDD')}.csv` :
        `medical_report_${record?.id}_${dayjs().format('YYYYMMDD')}.csv`;

      downloadCsv(transformedData, filename, headers);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <>
    
    <Show isLoading={isLoading}
    
    headerButtons={({ defaultButtons }) => (
      <>
        {defaultButtons}
        
        {role === "Admin" && record?.role === "Patient" && (
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
      {record?.role === "Patient" && (
        <>
          <Title level={5}>{"Health ID"}</Title>
          <TextField value={record?.healthId} />
        </>
      )}
      <Title level={5}>{"Date of Birth"}</Title>
      <TextField value={dayjs(record?.dateOfBirth).format("DD/MM/YYYY")} />
      <Title level={5}>{"Role"}</Title>
      <TextField value={record?.role} />
    </Show>
      <Modal 
        {...modalProps} 
        title="Generate Report"
        okText="Generate"
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerateReport}
        >
          <Form.Item
            name="reportType"
            label="Report Type"
            rules={[{ required: true, message: 'Please select report type' }]}
          >
            <Select
              options={[
                { label: 'Monthly Report', value: 'monthly' },
                { label: 'Yearly Report', value: 'yearly' },
              ]}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.reportType !== currentValues.reportType
            }
          >
            {({ getFieldValue }) => {
              const reportType = getFieldValue('reportType');
              return (
                <Form.Item
                  name="date"
                  label="Select Period"
                  rules={[{ required: true, message: 'Please select a date' }]}
                >
                  <DatePicker
                    picker={reportType === 'monthly' ? 'month' : 'year'}
                    disabledDate={(current) =>
                      current && current > dayjs().add(1, reportType === 'monthly' ? 'month' : 'year')
                    }
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
