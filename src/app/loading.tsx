import { Skeleton } from "@/components";

export default function Loading() {
    return (
        <div className="grid h-full min-h-[calc(100vh-80px-96px)] place-items-center">
            <div className=" grid w-full max-w-4xl gap-8 ">
                <div className="mx-auto flex w-fit gap-2 rounded-md border p-2">
                    <Skeleton className="h-[24px] w-[70px] rounded-md" />
                    <Skeleton className="h-[24px] w-[70px] rounded-md" />
                    <Skeleton className="h-[24px] w-[70px] rounded-md" />
                </div>

                <div className="grid gap-8">
                    <div className="flex h-5 items-center gap-4 text-xs text-gray-500">
                        <Skeleton className="h-[20px] w-[200px] rounded-md" />
                    </div>

                    <div className="grid h-24 gap-1">
                        <Skeleton className="h-[28.5px] w-full rounded-md" />
                        <Skeleton className="h-[28.5px] w-full rounded-md" />
                        <Skeleton className="h-[28.5px] w-[100px] rounded-md" />
                    </div>

                    <div className="mx-auto flex items-center gap-2">
                        <Skeleton className="h-[20px] w-[80px] rounded-md" />
                        <Skeleton className="h-[20px] w-[80px] rounded-md" />
                        <Skeleton className="h-[20px] w-[80px] rounded-md" />
                        <Skeleton className="h-[20px] w-[80px] rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
