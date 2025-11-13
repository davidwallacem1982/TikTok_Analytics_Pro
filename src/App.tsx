import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { TikTokConnect } from "./components/TikTokConnect";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TT</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">TikTok Analytics Pro</h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const tiktokAccount = useQuery(api.tiktok.getTikTokAccount);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Domine o TikTok com Analytics Avançados
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubra as maiores tendências, analise seu desempenho e crie conteúdo viral
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tendências em Tempo Real</h3>
                <p className="text-gray-600 text-sm">Acompanhe hashtags e sons virais antes da concorrência</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Recomendações IA</h3>
                <p className="text-gray-600 text-sm">Sugestões personalizadas para maximizar seu alcance</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Detalhados</h3>
                <p className="text-gray-600 text-sm">Métricas completas do seu desempenho no TikTok</p>
              </div>
            </div>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        {!tiktokAccount || !tiktokAccount.clientKey ? (
          <TikTokConnect />
        ) : (
          <Dashboard />
        )}
      </Authenticated>
    </div>
  );
}
