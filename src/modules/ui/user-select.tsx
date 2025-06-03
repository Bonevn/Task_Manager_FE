"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select";
import { useGetAllUsers } from "@/modules/user-settings/api/hooks";
import { RoleBadge } from "./role-badge";
import getImageUrl from "@/lib/get-image-url";

interface UserSelectProps {
    value: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
    className?: string;
}

export function UserSelect({
    value,
    onValueChange,
    placeholder = "Select user",
    className,
}: UserSelectProps) {
    const { data: users } = useGetAllUsers();

    return (
        <Select
            value={value || "unassigned"}
            onValueChange={(value: string) =>
                onValueChange(value === "unassigned" ? null : value)
            }
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="unassigned">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <span>Unassigned</span>
                    </div>
                </SelectItem>
                {users?.data.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={getImageUrl(user.picture || "")} />
                                <AvatarFallback>
                                    {user.name.substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                            <RoleBadge role={user.role || "USER"} />
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
} 