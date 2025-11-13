import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function TikTokConnect() {
  const [clientKey, setClientKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const connectAccount = useMutation(api.tiktok.connectTikTokAccount);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientKey.trim() || !clientSecret.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    try {
      await connectAccount({
        clientKey: clientKey.trim(),
        clientSecret: clientSecret.trim(),
      });
      
      toast.success("Conta TikTok conectada com sucesso!");
      setClientKey("");
      setClientSecret("");
    } catch (error) {
      console.error("Erro ao conectar conta:", error);
      toast.error("Erro ao conectar conta TikTok");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">TT</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conecte sua Conta TikTok
          </h2>
          <p className="text-gray-600">
            Insira suas credenciais da API do TikTok para começar a analisar suas métricas
          </p>
        </div>

        <form onSubmit={handleConnect} className="space-y-6">
          <div>
            <label htmlFor="clientKey" className="block text-sm font-medium text-gray-700 mb-2">
              Client Key
            </label>
            <input
              type="text"
              id="clientKey"
              value={clientKey}
              onChange={(e) => setClientKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              placeholder="Insira seu Client Key do TikTok"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <input
              type="password"
              id="clientSecret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              placeholder="Insira seu Client Secret do TikTok"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !clientKey.trim() || !clientSecret.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Conectando..." : "Conectar Conta"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Como obter suas credenciais:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Acesse o <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="underline">TikTok Developers</a></li>
            <li>2. Crie uma nova aplicação</li>
            <li>3. Copie o Client Key e Client Secret</li>
            <li>4. Cole as credenciais nos campos acima</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
