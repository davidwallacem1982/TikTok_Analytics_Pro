import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TrendingHashtags } from "./TrendingHashtags";
import { TrendingSounds } from "./TrendingSounds";
import { ContentRecommendations } from "./ContentRecommendations";
import { UserVideos } from "./UserVideos";
import { toast } from "sonner";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("trends");
  const [isLoading, setIsLoading] = useState(false);
  
  const tiktokAccount = useQuery(api.tiktok.getTikTokAccount);
  const syncData = useAction(api.tiktok.syncTikTokData);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncData();
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      toast.error("Erro ao sincronizar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "trends", label: "Tendências", icon: "🔥" },
    { id: "recommendations", label: "Recomendações", icon: "🎯" },
    { id: "analytics", label: "Meus Vídeos", icon: "📊" },
  ];

  return (
    <div className="space-y-6">
      {/* Header com informações da conta */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600">
              Conta conectada: {tiktokAccount?.username || "Configurando..."}
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sincronizando...
              </>
            ) : (
              <>
                🔄 Sincronizar Dados
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "trends" && (
            <div className="space-y-8">
              <TrendingHashtags />
              <TrendingSounds />
            </div>
          )}
          
          {activeTab === "recommendations" && <ContentRecommendations />}
          
          {activeTab === "analytics" && <UserVideos />}
        </div>
      </div>
    </div>
  );
}
