import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/_components/ui/sheet";
import Sidebar from "./sidebar";

type Props = {}

const MobileSidebar = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar/>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;