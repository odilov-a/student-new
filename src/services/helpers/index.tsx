import { AppstoreOutlined } from "@ant-design/icons";

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
    icon: <AppstoreOutlined />,
    route: "/problems",
  },
  {
    key: "tests",
    label: "Testlar",
    icon: <AppstoreOutlined />,
    route: "/tests",
  },
  {
    key: "training",
    label: "Treninglar",
    icon: <AppstoreOutlined />,
    route: "/training",
  },
  {
    key: "html",
    label: "HTML&CSS",
    icon: <AppstoreOutlined />,
    route: "/html",
  },
  // {
  //   key: "group",
  //   label: "Guruhlar",
  //   icon: <AppstoreOutlined />,
  //   route: "/groups",
  // },
  {
    key: "shop",
    label: "Do'kon",
    icon: <AppstoreOutlined />,
    route: "/shop",
  },
  {
    key: "resources",
    label: "Resurslar",
    icon: <AppstoreOutlined />,
    route: "/resources",
  },
  {
    key: "histories",
    label: "Tarix",
    icon: <AppstoreOutlined />,
    route: "/histories",
  },
  {
    key: "feedback",
    label: "Fikrlar",
    icon: <AppstoreOutlined />,
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
