import Breadcrumb from "@/app/components/Navigation/Breadcrumb";
import SideNav from "@/app/components/Dashboard/SideNav";
import Footer from "@/app/components/Navigation/Footer";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen">
            <SideNav />
            <div className="flex-1 flex flex-col p-4 ml-16 mt-16 transition-all overflow-auto duration-300">
                <Breadcrumb
                  homeElement={"Home"}
                  separator={<span> | </span>}
                  containerClasses="flex items-center space-x-2 text-gray-500"
                  listClasses="hover:text-blue-600"
                  activeClasses="text-amber-500"
                  capitalizeLinks
                  disabledPaths={["tasks"]}
                />
                <main className="my-4 text-slate-800">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
