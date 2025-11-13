import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserVideos() {
  const videos = useQuery(api.tiktok.getUserVideos, { limit: 20 });

  if (!videos) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "average": return "text-yellow-600 bg-yellow-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPerformanceLabel = (performance: string) => {
    switch (performance) {
      case "excellent": return "Excelente";
      case "good": return "Bom";
      case "average": return "Médio";
      case "poor": return "Fraco";
      default: return performance;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          📊 Meus Vídeos
        </h2>
        <div className="text-sm text-gray-600">
          {videos.length} vídeos analisados
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📹</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum vídeo encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Conecte sua conta TikTok e sincronize os dados para ver suas métricas
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all">
            🔄 Sincronizar Dados
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {video.title || `Vídeo ${video.tiktokVideoId}`}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPerformanceColor(video.performance)}`}>
                      {getPerformanceLabel(video.performance)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(video.publishTime).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-pink-600">
                    {video.engagementRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Engajamento</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(video.viewCount)}
                  </div>
                  <div className="text-xs text-blue-800">Visualizações</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-red-600">
                    {formatNumber(video.likeCount)}
                  </div>
                  <div className="text-xs text-red-800">Curtidas</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatNumber(video.commentCount)}
                  </div>
                  <div className="text-xs text-green-800">Comentários</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {formatNumber(video.shareCount)}
                  </div>
                  <div className="text-xs text-purple-800">Compartilhamentos</div>
                </div>
              </div>

              {video.hashtags.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Hashtags utilizadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {video.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Tempo de reprodução: {video.playTime}s
                </div>
                <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                  Ver Detalhes →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
