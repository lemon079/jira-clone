import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";
import Navigation from "./Navigation";
import WorkspaceSwitcher from "./workspace/WorkspaceSwitcher";
import ProjectSwitcher from "./projects/ProjectSwitcher";

const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href={"/"}>
                <Image src={"/logo.svg"} alt="logo" width={164} height={48} />
            </Link>
            <Separator className="my-4" />
            <WorkspaceSwitcher />
            <Separator className="my-4" />
            <Navigation />
            <Separator className="my-4" />
            <ProjectSwitcher />
        </aside>
    );
};

export default Sidebar;
