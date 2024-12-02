import { Skeleton } from "@/components/ui/skeleton"; // Ajuste o caminho conforme necessário
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function VehicleTableSkeleton() {
    return (
        <div className="w-full p-4 shadow rounded-lg">
            <div className="flex justify-between min-w-full max-w-screen-xl py-3 items-center p-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md mb-5">
                <Skeleton className="h-6 w-1/4" />
            </div>

            <div className="overflow-hidden rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Skeleton className="h-8 w-32" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-8 w-32" />
                            </TableHead>
                            {/* Adicione mais TableHead conforme necessário */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                {Array.from({ length: 3 }).map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <Skeleton className="h-8 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
