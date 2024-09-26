"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChartPieIcon, ClipboardIcon, CalendarDaysIcon  } from "@heroicons/react/24/outline";

const sections = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <ChartPieIcon />,
    subButtons: [
      {name: "General", href: "/dashboard"},
    ],
  },
  {
    name: "Projects",
    href: "/projects",
    icon: <ClipboardIcon />,
    subButtons: [
      {name: "List", href: "/projects"},
      {name: "Create", href: "/projects/new"},
    ],
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: <CalendarDaysIcon />,
    subButtons: []
  },
];

const SideNav = () => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const toggleSelection = (section: keyof typeof open) => {
    setOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const isActive = (href: string) => pathname === href;

  const isSectionActive = (sectionHref: string, subPaths: string[]) => {
    return pathname.startsWith(sectionHref) || subPaths.some(isActive);
  };

  return (
    <>
      {/* Mask */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-20"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-20 bg-white ${
        isExpanded ? "w-64" : "w-14"
      }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between p-2">
            {/* Logo */}
            {isExpanded && (
              <div className="ml-2">
                <div className="text-light-secondary text-lg font-bold">
                  <Link href="/">
                    Logo
                  </Link>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              className="ml-2 focus:outline-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {/* Icon for toggling sidebar */}
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isExpanded ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
                />
              </svg>
            </button>
          </div>

          <div className="flex-1">
            {sections.map((section) => (
              <div key={section.href}>
                <button
                  className={`flex items-center w-full text-left px-2 py-2 hover:bg-light-secondary hover:text-white focus:outline-none transition-colors ${
                    isSectionActive(
                      section.href,
                      section.subButtons.map((sub) => sub.href)
                    )
                      ? "bg-light-blue text-light-secondary"
                      : "text-light-blue"
                  } ${!isExpanded ? "justify-center" : ""}`}
                  onClick={() => toggleSelection(section.href)}
                >
                  <span className={`w-6 h-6 ${!isExpanded ? "mx-auto" : "ml-2 mr-4"}`}>{section.icon}</span>
                  {isExpanded && <span>{section.name}</span>}
                </button>
                {isExpanded && open[section.href] && section.subButtons.length > 0 && (
                  <div className="mx-10">
                    {section.subButtons.map((subButton) => (
                      <Link href={subButton.href} key={subButton.href}>
                        <button
                          className={`w-full text-left px-4 py-2 my-1 rounded-lg hover:bg-light-secondary hover:text-white focus:outline-none ${
                            isActive(subButton.href) ? "text-light-secondary" : "text-light-blue"
                          }`}
                        >
                          {subButton.name}
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>           
      </aside>
    </>
  );
};

export default SideNav;
