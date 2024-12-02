import * as React from "react";
import { RouteTrackingResponse } from "@/dto/responses/routes.response";
import { getStatusTrack } from "../tracking-components/user-info-track.component";

interface SelectTrackingProps {
  data: RouteTrackingResponse[];
  onSelectRoute: (route: RouteTrackingResponse) => void;
}

export function SelectTracking({ data, onSelectRoute }: SelectTrackingProps) {
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchMoreRoutes = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newRoutes = data.slice((page - 1) * 10, page * 10); 
      if (newRoutes.length === 0) setHasMore(false);
      else setPage(page + 1);
    } catch (error) {
      console.error("Erro ao carregar mais rotas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const bottom =
      e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom) fetchMoreRoutes();
  };

  const handleSelectChange = (routeId: string) => {
    const selectedRoute = data.find((route) => route.route.id.toString() === routeId);
    if (selectedRoute) {
      onSelectRoute(selectedRoute);
    }
  };

  return (
    <div
      onScroll={handleScroll}
      className="max-h-[800px] overflow-y-auto p-4 rounded-lg"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.map((route) => (
          <div
            key={route.route.id}
            onClick={() => handleSelectChange(route.route.id.toString())}
            className="cursor-pointer p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:border-primary border transition-all w-full"
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{route.route.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Usuário: {route.route.user}</p>

              <p className="text-sm text-gray-600 dark:text-gray-300">{getStatusTrack(route.route.status)}</p>
            </div>
          </div>
          
        ))}
      </div>
      {loading && (
        <div className="flex justify-center mt-4">
          <span>Carregando...</span>
        </div>
      )}
      {!hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <span>Não há mais rotas.</span>
        </div>
      )}
      
    </div>
  );
}


