"use client";

import { useGetSelf, useUpdateSelf, useUploadUserImage } from "./api";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Textarea } from "@/modules/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/card";
import { Label } from "@/modules/ui/label";
import { FileEmptyState } from "./components/file-empty-state";
import getImageUrl from "@/lib/get-image-url";

export default function UserSettings() {
	const { data: user } = useGetSelf();
	const updateSelf = useUpdateSelf();
	const { mutate: uploadFile, isPending: isUploading } = useUploadUserImage();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [formData, setFormData] = useState({
		name: "",
		bio: "",
		picture: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				bio: user.bio || "",
				picture: user.picture || "",
			});
		}
	}, [user]);

	const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData(prev => ({
			...prev,
			[field]: e.target.value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateSelf.mutateAsync(formData);
	};

	if (!user) return null;

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>User Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={user.email}
							disabled
							className="bg-muted"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={handleChange("name")}
							placeholder="Enter your name"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							id="bio"
							value={formData.bio}
							onChange={handleChange("bio")}
							placeholder="Tell us about yourself"
							rows={4}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex flex-row justify-between items-center">
							<Label htmlFor="picture">Profile Picture</Label>
							<div 
								className="text-sm text-gray-500 cursor-pointer hover:underline" 
								onClick={() => fileInputRef.current?.click()}
							>
								Change profile picture
							</div>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file && user) {
									uploadFile({ file, userId: user.id });
								}
								e.target.value = '';
							}}
							className="hidden"
						/>
						{formData.picture ? (
							<div className="relative w-32 h-32 rounded-full overflow-hidden">
								<img 
									src={getImageUrl(formData.picture)}
									alt="Profile picture"
									className="object-cover w-full h-full"
								/>
							</div>
						) : (
							<FileEmptyState onClick={() => {}} userId={user.id} />
						)}
					</div>

					<Button
						type="submit"
						disabled={updateSelf.isPending}
						className="w-full"
					>
						{updateSelf.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
