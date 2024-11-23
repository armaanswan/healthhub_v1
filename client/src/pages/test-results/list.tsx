import {
  DateField,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useGetIdentity } from "@refinedev/core";
import { Radio, Select, Space, Table } from "antd";
import { USER_ROLE } from "../../authProvider";
import { User } from "../../lib/api/schemas";

export const TestResultList = () => {
  const { data: user } = useGetIdentity<User>();

  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      permanent:
        user?.role === "Patient"
          ? [
              {
                field: "patientId",
                operator: "eq",
                value: user?.id,
              },
            ]
          : [],
    },
  });



  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column dataIndex={["patientId", "fullName"]} title={"Patient"} />
        <Table.Column dataIndex={["doctorId", "fullName"]} title={"Doctor"} />
        <Table.Column
          dataIndex="examType"
          title={"Exam Type"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: "BGL", label: "Blood Glucose Level (mg/dL)" },
                  { value: "BP", label: "Blood Pressure (mmHg)" },
                  { value: "BT", label: "Body Temperature (°C)" },
                  { value: "CL", label: "Cholesterol Level (mg/dL)" },
                  { value: "BMI", label: "Body Mass Index (kg/m²)" },
                ]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column dataIndex="result" title={"Exam Result"} />
        <Table.Column
          dataIndex="isAbnormal"
          title={"Conclusion"}
          render={(value) => {
            if (value === undefined) return "-";
            return value ? "Abnormal" : "Normal";
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Radio.Group>
                <Radio value="true">Abnormal</Radio>
                <Radio value="false">Normal</Radio>
              </Radio.Group>
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="isReady"
          title={"Status"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Radio.Group>
                <Radio value="true">Ready</Radio>
                <Radio value="false">Prescribed</Radio>
              </Radio.Group>
            </FilterDropdown>
          )}
          render={(value) => {
            return value ? "Ready" : "Prescribed";
          }}
        />
        <Table.Column 
          dataIndex="createdDate" 
          title={"Created Date"}
          render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
          sorter
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
