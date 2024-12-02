import { CardContent } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getRoutesByUserId } from "@/services/routes.service"
import { useEffect, useState } from "react"
import { RadialBarChart, PolarRadiusAxis, Label, RadialBar } from "recharts"
export const description = "A radial chart with stacked sections"
const chartData = [{ month: "january", desktop: 0, mobile: 0 }]
const chartConfig = {
    desktop: {
        label: "Com alertas",
        color: "#ef4444",
    },
    mobile: {
        label: "Sem alertas",
        color: "#22c55e",
    },
} satisfies ChartConfig

interface DriverScoreTrackProps {
    userId: string;
    userName: string;
}


export function DriverScoreTrack({ userId, userName }: DriverScoreTrackProps) {
    const [chartData, setChartData] = useState([{ desktop: 0, mobile: 0 }]);
    const totalVisitors = chartData[0].desktop + chartData[0].mobile

    useEffect(() => {
        async function fetchData() {
            try {
                const routes = await getRoutesByUserId(userId);

                const finishedWithAlerts = routes.filter(route => route.route.status === "FINISHED" && route.route!.alerts!.length > 0).length;
                const finishedWithoutAlerts = routes.filter(route => route.route.status === "FINISHED" && (!route.route.alerts || route.route.alerts.length === 0)).length;

                setChartData([
                    {
                        desktop: finishedWithAlerts,
                        mobile: finishedWithoutAlerts,
                    },
                ]);
            } catch (error) {
                console.error("Failed to fetch route data:", error);
            }
        }

        fetchData();
    }, [userId]);

    return (
        <div className="dark:bg-zinc-800 bg-zinc-100 p-4 rounded-md flex flex-col justify-between h-72">
            <h1 className="text-2xl font-bold">Histórico de Rotas</h1>
            <h4 className="dark:text-zinc-600">Histórico de rotas concluidas pelo {userName}</h4>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    Rotas Concluidas
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="desktop"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-desktop)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="mobile"
                            fill="var(--color-mobile)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </div>
    )
}