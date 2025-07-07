import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const Root = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-[calc(100vh-520px)] max-w-7xl mx-auto mt-28 mb-14 px-4 md:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
);
};

export default Root;
