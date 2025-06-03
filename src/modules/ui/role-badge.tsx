import { Badge } from "@/modules/ui/badge";

type Role = "OWNER" | "ADMIN" | "PM" | "DEV" | "TESTER" | "USER" | "MEMBER";

interface RoleBadgeProps {
    role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
    const badgeClasses = {
        OWNER: "bg-red-500 text-white hover:bg-red-500",
        ADMIN: "bg-red-500 text-white hover:bg-red-500", 
        PM: "bg-green-500 text-white hover:bg-green-500",
        DEV: "bg-blue-500 text-white hover:bg-blue-500",
        TESTER: "bg-yellow-500 text-black hover:bg-yellow-500",
        USER: "bg-gray-500 text-white hover:bg-gray-500",
        MEMBER: "bg-gray-500 text-white hover:bg-gray-500"
    };

    return (
        <div className="flex items-center gap-2">
            <Badge className={badgeClasses[role || "USER"]}>{role}</Badge>
        </div>
    );
}