import React, { FC } from "react";
import "./Page.scss";

interface PageProps {
  children: React.ReactNode;
}

const Page: FC<PageProps> = ({ children }) => {
  return <div className="page">{children}</div>;
};

export default Page;
