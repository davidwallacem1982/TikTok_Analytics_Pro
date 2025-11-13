import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ContentRecommendations() {
  const [selectedType, setSelectedType] = useState<string>("");
  
  const recommendations = useQuery(api.tiktok.getContentRecommendations, {
    type: selectedType as any || undefined,
    limit: 20,
  });

  const types = [
    { value: "hashtag", label: "Hashtags", icon: "#" },
    { value: "sound", label: "Sons", icon: "🎵" },
    { value: "topic", label: "Tópicos", icon: "💡" },
  ];

  if (!recommendations) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Fácil";
      case "medium": return "Médio";
      case "hard": return "Difícil";
      default: return difficulty;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🎯 Recomendações Personalizadas
        </h2>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        >
          <option value="">Todos os tipos</option>
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={rec._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {rec.type === "hashtag" ? "#" : rec.type === "sound" ? "🎵" : "💡"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {rec.content}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {rec.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(rec.difficulty)}`}>
                      {getDifficultyLabel(rec.difficulty)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600">
                  {rec.trendScore}
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {rec.reason}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Alcance Potencial</div>
                <div className="font-bold text-gray-900">
                  {(rec.potentialReach / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Tipo</div>
                <div className="font-bold text-gray-900 capitalize">
                  {rec.type === "hashtag" ? "Hashtag" : rec.type === "sound" ? "Som" : "Tópico"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Gerado em {new Date(rec.generatedAt).toLocaleDateString('pt-BR')}
              </div>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all">
                Usar Agora
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma recomendação disponível
          </h3>
          <p className="text-gray-600 mb-4">
            Sincronize seus dados para receber recomendações personalizadas
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all">
            🔄 Sincronizar Dados
          </button>
        </div>
      )}
    </div>
  );
}
