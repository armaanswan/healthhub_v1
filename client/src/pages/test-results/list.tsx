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

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany({
  //   resource: "categories",
  //   ids:
  //     tableProps?.dataSource
  //       ?.map((item) => item?.category?.id)
  //       .filter(Boolean) ?? [],
  //   queryOptions: {
  //     enabled: !!tableProps?.dataSource,
  //   },
  // });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column dataIndex={["patientId", "fullName"]} title={"Patient"} />
        <Table.Column dataIndex={["doctorId", "fullName"]} title={"Doctor"} />
        <Table.Column dataIndex="examType" title={"Exam Type"} />
        <Table.Column dataIndex="result" title={"Exam Result"} />
        <Table.Column
          dataIndex="isAbnormal"
          title={"Conclusion"}
          render={(value) => {
            if (value === undefined) return "-";
            return value ? "Abnormal" : "Normal";
          }}
        />
        <Table.Column
          dataIndex="isReady"
          title={"Status"}
          render={(value) => {
            return value ? "Ready" : "Prescribed";
          }}
        />
        {/* <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          dataIndex={"category"}
          title={"Category"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value?.id)?.title
            )
          }
        />
        <Table.Column dataIndex="status" title={"Status"} />
        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        /> */}
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
