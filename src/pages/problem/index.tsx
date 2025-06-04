import axios from "axios";
import { Table, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Container } from "modules";
import { useHooks } from "hooks";
import { useState } from "react";

const Problem = () => {
  const { t } = useHooks();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const columns = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      render: (text: any) => (
        <span className="dark:text-[#e5e7eb] flex items-center justify-center flex-row w-20">
          {text}
        </span>
      ),
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      render: (text: any) => (
        <span
          className="dark:text-[#e5e7eb] line-clamp-2"
          dangerouslySetInnerHTML={{ __html: text }}
        />
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
      title: t("Difficulty"),
      dataIndex: ["difficulty", "title"],
      key: "difficulty",
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
            navigate(`/problems/${record._id}`);
          }}
        >
          {t("Solve")}
        </Button>
      ),
    },
  ];

  const handleSearch = async (value: string) => {
    setSearch(value);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ROOT_API}/problems/search?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFilteredItems(response.data.data);
    } catch (error) {
      message.error(t("Failed to fetch search results"));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Input.Search
        placeholder={t("Search problems")}
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
      />
      <Container.All name="problems" url="/problems">
        {({ items }) => (
          <div className="flex-grow overflow-auto">
            <Table
              columns={columns}
              dataSource={search ? filteredItems : items}
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

export default Problem;
