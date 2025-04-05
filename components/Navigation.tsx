"use client"
import { SettingsIcon, UserIcon } from "lucide-react";
import React from "react";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId";
import { usePathname } from "next/navigation";

const links = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon,
    },
    {
        label: "Members",
        href: "/members",
        icon: UserIcon,
        activeIcon: UserIcon,
    },
];

const Navigation = () => {

    const workspaceId = useWorkspaceId();
    const pathname = usePathname();

    return (
        <ul className="flex flex-col">
            {links.map((link) => {
                const fullHref = `/workspaces/${workspaceId}${link.href}`
                const isActive = pathname === fullHref;
                const Icon = (isActive ? link.activeIcon : link.icon) as React.ComponentType<{ className?: string }>;

                return (
                    <Link key={link.href} href={fullHref}>
                        <div
                            className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                            )}
                        >
                            <Icon className="size-5 text-neutral-500" />
                            {link.label}
                        </div>
                    </Link>
                );
            })}
        </ul>
    );
};

export default Navigation;
