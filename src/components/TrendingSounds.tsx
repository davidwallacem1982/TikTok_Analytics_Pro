import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TrendingSounds() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const sounds = useQuery(api.tiktok.getTrendingSounds, {
    category: selectedCategory || undefined,
    limit: 15,
  });

  const categories = ["Música", "Comédia", "Dança", "Trending", "Original"];

  if (!sounds) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🎵 Sons em Tendência
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
        {sounds.map((sound, index) => (
          <div
            key={sound._id}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 text-sm mb-1 line-clamp-2">
                  {sound.title}
                </h3>
                {sound.artist && (
                  <p className="text-xs text-blue-600 mb-2">
                    por {sound.artist}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                <div className={`w-2 h-2 rounded-full ${
                  sound.trendScore >= 90 ? 'bg-green-500' :
                  sound.trendScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duração:</span>
                <span className="font-semibold">
                  {sound.duration}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usos:</span>
                <span className="font-semibold">
                  {(sound.useCount / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-semibold text-indigo-600">
                  {sound.category}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Trend Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${sound.trendScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {sound.trendScore}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full mt-3 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
              🎵 Usar este Som
            </button>
          </div>
        ))}
      </div>

      {sounds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum som encontrado
          </h3>
          <p className="text-gray-600">
            Tente sincronizar os dados ou selecionar uma categoria diferente
          </p>
        </div>
      )}
    </div>
  );
}
