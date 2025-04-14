"use client";

import ModeToggle from "@/components/shared/mode-toggle";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlobalSearch from "./global-search";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
function Navbar() {
  const pathname = usePathname();

  return (
    <div className="h-[10vh] backdrop-blur-sm border-b fixed z-40 inset-0 bg-background">
      <div className="container max-w-6xl mx-auto h-[10vh] w-full flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-4xl font-creteRound">Umidjon</h1>
        </Link>
        {/* Nav links */}
        <div className="gap-2 hidden md:flex">
          {navLinks.map((nav) => (
            <Link
              key={nav.route}
              href={nav.route}
              className={cn(
                "hover:bg-blue-400/20 py-1 px-3 cursor-pointer rounded-sm transition-colors",
                pathname === nav.route && "text-blue-400"
              )}
            >
              {nav.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-1">
          <GlobalSearch />
          <ModeToggle />
          {/* Mobile nav */}
          <div className="md:hidden">
            {" "}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {" "}
                <SheetTitle className="flex items-center cursor-pointer gap-2 text-2xl font-creteRound mt-7 ">
                  <div>
                    <Image
                      src={"/favicon.png"}
                      alt="logo"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p>Umidjon</p>
                </SheetTitle>
                <div className="flex flex-col gap-2 mt-28">
                  {navLinks.map((nav) => (
                    <Link
                      key={nav.route}
                      href={nav.route}
                      className={cn(
                        "hover:bg-blue-400/20 py-1 px-3 cursor-pointer rounded-sm transition-colors",
                        pathname === nav.route && "text-blue-400"
                      )}
                    >
                      {nav.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
