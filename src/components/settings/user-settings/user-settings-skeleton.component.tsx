import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function UserSettingsSkeleton() {
    return (
        <div className="w-full p-4 shadow rounded-lg">
            <h2 className="flex justify-between min-w-full max-w-screen-xl py-3 items-center p-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md mb-5">
                <Skeleton className="h-6 w-1/4" />
            </h2>

            {/* Formulário para informações do usuário */}
            <form className="flex py-3 items-center flex-col p-5 gap-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md">
                <div className="flex flex-col items-center gap-3">
                    <Skeleton className="h-6 w-1/4 mb-1" />
                    <div className="relative">
                        <Skeleton className="rounded-full w-32 h-32" />
                        <input type="file" className="hidden" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-5 w-full">
                    <div className="w-full">
                        <Skeleton className="h-6 w-1/4 mb-1" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="w-full">
                        <Skeleton className="h-6 w-1/4 mb-1" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                <Button className="w-full" disabled>
                    <Skeleton className="h-10 w-full" />
                </Button>
            </form>

            <hr className="my-8" />

            {/* Formulário para alteração de senha */}
            <form className="flex py-3 items-center flex-col p-5 gap-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md">
                <div className="w-full">
                    <Skeleton className="h-6 w-1/4 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="w-full">
                    <Skeleton className="h-6 w-1/4 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="w-full">
                    <Skeleton className="h-6 w-1/4 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <Button className="w-full" disabled>
                    <Skeleton className="h-10 w-full" />
                </Button>
            </form>
        </div>
    );
}
