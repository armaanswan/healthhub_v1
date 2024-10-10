import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useGetIdentity, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import { User } from "../../lib/api/schemas";

export const UserList = () => {
  const { data: user } = useGetIdentity<User>();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column dataIndex="firstName" title="First Name" />
        <Table.Column dataIndex="lastName" title="Last Name" />
        <Table.Column dataIndex="email" title="Email" />

        <Table.Column dataIndex="role" title="Role" />
        {/* <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        /> */}
        {/* <Table.Column
          dataIndex={"category"}
          title={"Category"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value?.id)?.title
            )
          }
        /> */}
        {/* <Table.Column dataIndex="status" title={"Status"} /> */}
        {/* <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        /> */}
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                disabled={user?.id === record.id}
              />
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                disabled={user?.id === record.id}
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                disabled={user?.id === record.id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
