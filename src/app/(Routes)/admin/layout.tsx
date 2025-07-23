'use client';
import Footer from "@/components/ui/Layout/Footer";
import Header from "@/components/ui/Layout/Header";
import Sidebar from "@/components/ui/Layout/SideBar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
      <div className="flex flex-col min-h-screen">
      <Header /> 
      <div className="flex flex-1">
        <Sidebar/>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}