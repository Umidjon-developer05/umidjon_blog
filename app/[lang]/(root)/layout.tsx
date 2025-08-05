import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import GlobalSearchMobile from "./_components/global-search-mobile";
import { getDictionary } from "@/lib/dictionaries";
interface Props {
  params: { lang: "en" | "uz" };
  children: React.ReactNode;
}

async function Layout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return (
    <div>
      {
        <Navbar
          session={session ?? { user: { id: "" } }}
          lang={lang}
          dictionary={dictionary}
        />
      }
      <div className="container">
        {children}

        <div className="fixed bottom-20 right-5">
          <GlobalSearchMobile />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
