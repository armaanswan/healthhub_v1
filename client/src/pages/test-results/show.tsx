import { Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export const TestResultShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  const { data: doctor } = useOne({
    resource: "users",
    id: record?.doctorId,
  });

  const { data: patient } = useOne({
    resource: "users",
    id: record?.patientId,
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"Doctor"}</Title>
      <TextField value={doctor?.data?.fullName} />
      <Title level={5}>{"Patient"}</Title>
      <TextField value={patient?.data?.fullName} />
      <Title level={5}>{"Exam Type"}</Title>
      <TextField value={record?.examType} />
      {record?.result ? (
        <>
          <Title level={5}>{"Exam Result"}</Title>
          <TextField value={record?.result} />
          <Title level={5}>{"Exam Date"}</Title>
          <TextField
            value={
              record?.createdDate
                ? dayjs(record?.createdDate).format("DD/MM/YYYY")
                : "-"
            }
          />
        </>
      ) : (
        <Title level={4}>{"Waiting for results"}</Title>
      )}
    </Show>
  );
};
