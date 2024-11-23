import {
  DateField,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, CanAccess, useGetIdentity } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import { User } from "../../lib/api/schemas";
import dayjs from "dayjs";

export const PatientList = () => {
  const { data: user } = useGetIdentity<User>();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="firstName"
          title="First Name"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="lastName"
          title="Last Name"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="email"
          title="Email"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="dateOfBirth"
          title="Date of Birth"
          sorter={(a: any, b: any) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix()}
          render={(value) => value ? dayjs(value).format('YYYY-MM-DD') : '-'}
        />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <CanAccess action="edit" resource="patients">
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  disabled={user?.id === record.id}
                />
              </CanAccess>
              <CanAccess action="show" resource="patients">
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  disabled={user?.id === record.id}
                />
              </CanAccess>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
