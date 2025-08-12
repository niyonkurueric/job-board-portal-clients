import React from "react";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default PublicLayout;
