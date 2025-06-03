interface TaskDescriptionProps {
    description: string;
}

export default function TaskDescription({ description }: TaskDescriptionProps) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-lg font-bold">Description</p>
            <p>{description}</p>
        </div>
    )
}