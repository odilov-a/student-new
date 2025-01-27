import { Row, Table } from "antd";
import { Container } from "modules";
import { useHooks } from "hooks";
import "./main.css";

interface StudentRecord {
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    photoUrl: string[];
  };
  problemId: string;
  code: string;
  language: string;
  isCorrect: boolean;
  failedTestCaseIndex: number | null;
  timeLimit: number | null;
  memoryLimit: number | null;
}

const Student = () => {
  const { t } = useHooks();
  const columns = [
    {
      title: t("First Name"),
      dataIndex: ["studentId", "firstName"],
      key: "firstName",
      ellipsis: true,
    },
    {
      title: t("Last Name"),
      dataIndex: ["studentId", "lastName"],
      key: "lastName",
      ellipsis: true,
    },
    {
      title: t("Language"),
      dataIndex: "language",
      key: "language",
      ellipsis: true,
    },
    {
      title: t("Memory Limit"),
      dataIndex: "memoryLimit",
      key: "memoryLimit",
      ellipsis: true,
      render: (memoryLimit: number | null) => `${memoryLimit ? memoryLimit : 0} MB`,
    },
    {
      title: t("Time Limit"),
      dataIndex: "timeLimit",
      key: "timeLimit",
      ellipsis: true,
      render: (timeLimit: number | null) => `${timeLimit ? timeLimit : 0} milliseconds`,
    },
    {
      title: t("Failed Test Cases"),
      dataIndex: "failedTestCaseIndex",
      key: "failedTestCaseIndex",
      ellipsis: true,
      render: (failedTestCaseIndex: number | null) =>
        failedTestCaseIndex !== null
          ? `${failedTestCaseIndex} test case failed`
          : "No failures",
    },
  ];

  return (
    <Container.All name="students" url="/students/histories">
      {({ items }: { items: object[] }) => (
        <Row>
          <Table
            columns={columns}
            dataSource={items}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            rowClassName={(record) =>
              (record as StudentRecord).isCorrect ? "row-green" : "row-red"
            }
          />
        </Row>
      )}
    </Container.All>
  );
};

export default Student;
