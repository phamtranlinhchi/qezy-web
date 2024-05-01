import { ReactNode } from "react";

import NavBar from "./NavBar";
import Footer from "./Footer";

export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: "78vh", padding: "20px" }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
