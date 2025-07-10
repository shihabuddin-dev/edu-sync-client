import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const Root = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-[calc(100vh-520px)] py-16 md:py-24">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
);
};

export default Root;
