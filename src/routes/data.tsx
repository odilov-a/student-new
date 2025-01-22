import { lazy } from "react";

const User = lazy(() => import("pages/admin"));
const Problem = lazy(() => import("pages/problem"));
const Default = lazy(() => import("pages/default"));
const History = lazy(() => import("pages/history"));
const NotFound = lazy(() => import("pages/notFound"));
const Training = lazy(() => import("pages/training"));
const Feedback = lazy(() => import("pages/feedback"));
const SolveProblemPage = lazy(() => import("pages/solveProblemPage"));

export interface IRoute {
  path: string;
  key?: string | "*";
  element: JSX.Element;
  inner?: IRoute[];
  index?: boolean;
  title: string;
}

const privateRoutes: IRoute[] = [
  {
    path: "/",
    key: "welcome",
    title: "",
    element: <Default />,
  },
  {
    path: "/profile",
    key: "profile",
    title: "Profil",
    element: <User />,
  },
  {
    path: "/training",
    key: "training",
    title: "Treninglar",
    element: <Training />,
  },
  {
    path: "/problems",
    key: "problems",
    title: "Masalalar",
    element: <Problem />,
  },
  {
    path: "/problems/:id",
    key: "problems",
    title: "",
    element: <SolveProblemPage />,
  },
  {
    path: "/feedback",
    key: "feedback",
    title: "Fikrlar",
    element: <Feedback />,
  },
  {
    path: "/histories",
    key: "histories",
    title: "Tarix",
    element: <History />,
  },
  {
    path: "*",
    key: "*",
    title: "",
    element: <NotFound />,
  },
];

const publicRoutes: IRoute[] = [
  // {
  //   path: "/about",
  //   key: "about",
  //   title: "About",
  //   element: <About />,
  // },
];

export { privateRoutes, publicRoutes };
