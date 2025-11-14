import Footer from "../../components/global/footer";
import Section_1 from "../../components/Homepage/Section_1";
import Section_2 from "../../components/Homepage/Section_2";
import Section_3 from "../../components/Homepage/Section_3";
import Section_4 from "../../components/Homepage/Section_4";
import { NavBar } from "../../components/global/NavBar";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Section_1 />
      <Section_2 />
      <Section_3 />
      <Section_4 />
      <Footer />
    </>
  );
}
