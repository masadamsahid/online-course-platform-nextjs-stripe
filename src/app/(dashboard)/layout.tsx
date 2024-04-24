import { NextjsLayoutBaseProps } from "@/types";

type Props = {} & NextjsLayoutBaseProps;

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}

export default DashboardLayout;