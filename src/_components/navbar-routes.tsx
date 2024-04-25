"use client"

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/_components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

type Props = {}

const NavbarRoutes = (props: Props) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");



  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Button asChild size='sm' variant='ghost'>
          <Link href="/">
            <LogOut className="size-4 mr-2" />
            Exit
          </Link>
        </Button>
      ) : (
        <Button asChild size='sm' variant='ghost'>
          <Link href="/teacher/courses">
            Teacher mode
          </Link>
        </Button>
      )}
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  );
}

export default NavbarRoutes;