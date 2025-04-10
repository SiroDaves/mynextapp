"use client";
import { UserMenuNavigationProps } from "@/lib/app";
import { useAppStore } from "@/state/app";
import { useAuthStore } from "@/state/auth/auth";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import {
  AlignLeftIcon,
  ChevronDownIcon,
  LockIcon,
  User2Icon,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import NavbarContext from "./nav-context";

interface NavbarProps {
  navigation: UserMenuNavigationProps[];
}

export const Navbar: FC<NavbarProps> = ({ navigation }) => {
  const { toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  const router = useRouter();
  const signOut = () => {
    logout();
    router.push("/login");
  };
  const handleOpenSidebar = () => toggleSidebar(true);

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white">
      <button
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tandaPurple md:hidden"
        onClick={handleOpenSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <AlignLeftIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <NavbarContext />
        </div>

        {/* Profile dropdown */}
        <Menubar className="ml-4 mx-2 my-2 md:ml-6">
          <MenubarMenu>
            <MenubarTrigger className="rounded-full flex items-center">
              <span className="p-2 mr-2 font-medium border-2 rounded-xl">
                <User2Icon strokeWidth={1.25} />
              </span>
              <span className="text-gray-700">
                {user?.firstName + " " + user?.lastName}
              </span>
              <span>
                <ChevronDownIcon strokeWidth={1.25} />
              </span>
            </MenubarTrigger>
            <MenubarContent className=" space-y-2 bg-white py-2 w-48 z-10 rounded-md">
              <Link href="/accounts/profile">
                <MenubarItem
                  className="text-start mt-5 text-gray-700 px-3 cursor-pointer 
                hover:bg-gray-200 hover:text-black py-2 w-full"
                >
                  <div className="flex justify-start items-center space-x-2 ">
                    <UserCircle size={15} strokeWidth={1.25} />
                    <span>Profile</span>
                  </div>
                </MenubarItem>
              </Link>

              <MenubarItem
                className="text-start mt-5 text-gray-700 px-3 cursor-pointer
                 hover:bg-gray-200 hover:text-black py-2 w-full"
                onClick={() => signOut()}
              >
                <div className="flex justify-start items-center space-x-2">
                  <LockIcon size={15} strokeWidth={1.25} />
                  <span> Sign out</span>
                </div>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
