import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Container } from "modules";
import { useHooks } from "hooks";

const Test = () => {
  const { t } = useHooks();
  const navigate = useNavigate();

  const columns = [
    {
      title: t("Title"),
      dataIndex: "name",
      key: "name",
      render: (text: any) => (
        <span className="dark:text-[#e5e7eb] flex items-center justify-center flex-row w-20">
          {text}
        </span>
      ),
    },
    {
      title: t("Points"),
      dataIndex: "point",
      key: "point",
      render: (text: any) => (
        <span className="dark:text-[#e5e7eb]">{text}</span>
      ),
    },
    {
      title: t("Subject"),
      dataIndex: "subject",
      key: "subject",
      render: (text: any) => (
        <span className="dark:text-[#e5e7eb]">{text}</span>
      ),
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: any, record: any) => (
        <Button
          type="primary"
          className="bg-black"
          onClick={() => {
            navigate(`/tests/${record._id}`);
          }}
        >
          {t("Solve")}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Container.All name="tests" url="/tests">
        {({ items }) => (
          <div className="flex-grow overflow-auto">
            <Table
              columns={columns}
              dataSource={items}
              pagination={{ pageSize: 12 }}
              rowKey="_id"
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>
        )}
      </Container.All>
    </div>
  );
};

export default Test;
