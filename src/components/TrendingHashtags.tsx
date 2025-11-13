import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TrendingHashtags() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const hashtags = useQuery(api.tiktok.getTrendingHashtags, {
    category: selectedCategory || undefined,
    limit: 20,
  });

  const categories = ["Geral", "Dança", "Comédia", "Culinária", "Lifestyle", "Música"];

  if (!hashtags) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🔥 Hashtags em Tendência
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hashtags.map((hashtag, index) => (
          <div
            key={hashtag._id}
            className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-pink-600">
                {hashtag.hashtag}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                <div className={`w-2 h-2 rounded-full ${
                  hashtag.trendScore >= 90 ? 'bg-green-500' :
                  hashtag.trendScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Visualizações:</span>
                <span className="font-semibold">
                  {(hashtag.viewCount / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts:</span>
                <span className="font-semibold">
                  {(hashtag.postCount / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engajamento:</span>
                <span className="font-semibold text-green-600">
                  {hashtag.engagementRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-semibold text-purple-600">
                  {hashtag.category}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-pink-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Trend Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${hashtag.trendScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {hashtag.trendScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hashtags.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma hashtag encontrada
          </h3>
          <p className="text-gray-600">
            Tente sincronizar os dados ou selecionar uma categoria diferente
          </p>
        </div>
      )}
    </div>
  );
}
