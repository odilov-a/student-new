import {
  LineChartOutlined,
  BookOutlined,
  BellOutlined,
  OrderedListOutlined,
  Html5Outlined,
} from "@ant-design/icons";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
}

const menuItems: MenuItem[] = [
  {
    key: "problems",
    label: "Masalalar",
    icon: <OrderedListOutlined />,
    route: "/problems",
  },
  {
    key: "training",
    label: "Treninglar",
    icon: <LineChartOutlined />,
    route: "/training",
  },
  {
    key: "html",
    label: "HTML&CSS",
    icon: <Html5Outlined />,
    route: "/html",
  },
  {
    key: "shop",
    label: "Do'kon",
    icon: <BookOutlined />,
    route: "/shop",
  },
  {
    key: "resources",
    label: "Resurslar",
    icon: <BookOutlined />,
    route: "/resources",
  },
  {
    key: "histories",
    label: "Tarix",
    icon: <BookOutlined />,
    route: "/histories",
  },
  {
    key: "feedback",
    label: "Fikrlar",
    icon: <BellOutlined />,
    route: "/feedback",
  },
];

function gen4() {
  return Math.random()
    .toString(16)
    .slice(-4);
}

export default {
  menuItems,
};

export { gen4 };
