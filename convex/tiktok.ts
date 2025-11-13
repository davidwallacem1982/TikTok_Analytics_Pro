import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

// Conectar conta TikTok
export const connectTikTokAccount = mutation({
  args: {
    clientKey: v.string(),
    clientSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se já existe uma conta conectada
    const existingAccount = await ctx.db
      .query("tiktokAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingAccount) {
      // Atualizar credenciais existentes
      await ctx.db.patch(existingAccount._id, {
        clientKey: args.clientKey,
        clientSecret: args.clientSecret,
        isActive: true,
      });
      return existingAccount._id;
    } else {
      // Criar nova conta
      return await ctx.db.insert("tiktokAccounts", {
        userId,
        clientKey: args.clientKey,
        clientSecret: args.clientSecret,
        isActive: true,
      });
    }
  },
});

// Obter dados da conta conectada
export const getTikTokAccount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("tiktokAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Buscar tendências de hashtags
export const getTrendingHashtags = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    if (args.category) {
      return await ctx.db
        .query("trendingHashtags")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
    } else {
      return await ctx.db
        .query("trendingHashtags")
        .withIndex("by_trend_score")
        .order("desc")
        .take(limit);
    }
  },
});

// Buscar sons em tendência
export const getTrendingSounds = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    if (args.category) {
      return await ctx.db
        .query("trendingSounds")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
    } else {
      return await ctx.db
        .query("trendingSounds")
        .withIndex("by_trend_score")
        .order("desc")
        .take(limit);
    }
  },
});

// Obter vídeos do usuário
export const getUserVideos = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 50;
    
    return await ctx.db
      .query("userVideos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

// Obter recomendações de conteúdo
export const getContentRecommendations = query({
  args: {
    type: v.optional(v.union(v.literal("hashtag"), v.literal("sound"), v.literal("topic"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 10;
    
    let query = ctx.db
      .query("contentRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", userId));
    
    const recommendations = await query.order("desc").take(limit);
    
    if (args.type) {
      return recommendations.filter(rec => rec.type === args.type);
    }
    
    return recommendations;
  },
});

// Obter relatório de analytics
export const getAnalyticsReport = query({
  args: {
    reportType: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("trend_analysis")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("analyticsReports")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("reportType"), args.reportType))
      .order("desc")
      .first();
  },
});

// Action para sincronizar dados do TikTok
export const syncTikTokData = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar conta TikTok do usuário
    const account = await ctx.runQuery(api.tiktok.getTikTokAccount);
    if (!account || !account.clientKey) {
      throw new Error("Conta TikTok não conectada");
    }

    // Simular dados de tendências (em produção, usar TikTok API real)
    const mockTrendingHashtags = [
      { hashtag: "#fyp", viewCount: 1000000000, postCount: 500000, engagementRate: 8.5, category: "Geral", trendScore: 95 },
      { hashtag: "#viral", viewCount: 800000000, postCount: 300000, engagementRate: 7.8, category: "Geral", trendScore: 92 },
      { hashtag: "#dance", viewCount: 600000000, postCount: 250000, engagementRate: 9.2, category: "Dança", trendScore: 89 },
      { hashtag: "#comedy", viewCount: 550000000, postCount: 200000, engagementRate: 8.9, category: "Comédia", trendScore: 87 },
      { hashtag: "#food", viewCount: 400000000, postCount: 180000, engagementRate: 7.5, category: "Culinária", trendScore: 84 },
      { hashtag: "#lifestyle", viewCount: 350000000, postCount: 160000, engagementRate: 7.2, category: "Lifestyle", trendScore: 82 },
      { hashtag: "#music", viewCount: 320000000, postCount: 140000, engagementRate: 8.1, category: "Música", trendScore: 80 },
      { hashtag: "#tutorial", viewCount: 280000000, postCount: 120000, engagementRate: 6.8, category: "Educativo", trendScore: 78 },
    ];

    const mockTrendingSounds = [
      { soundId: "sound1", title: "Trending Beat 2024", artist: "DJ Viral", duration: 15, useCount: 150000, trendScore: 94, category: "Música" },
      { soundId: "sound2", title: "Comedy Sound Effect", artist: "SFX Master", duration: 8, useCount: 120000, trendScore: 91, category: "Comédia" },
      { soundId: "sound3", title: "Dance Challenge Beat", artist: "Beat Maker", duration: 20, useCount: 100000, trendScore: 88, category: "Dança" },
      { soundId: "sound4", title: "Motivational Speech", artist: "Speaker Pro", duration: 30, useCount: 85000, trendScore: 85, category: "Motivacional" },
      { soundId: "sound5", title: "Cooking Background", artist: "Kitchen Sounds", duration: 25, useCount: 70000, trendScore: 82, category: "Culinária" },
    ];

    // Inserir/atualizar hashtags em tendência
    for (const hashtag of mockTrendingHashtags) {
      const existing = await ctx.runQuery(internal.tiktok.findHashtagByName, { hashtag: hashtag.hashtag });
      
      if (existing) {
        await ctx.runMutation(internal.tiktok.updateHashtag, {
          id: existing._id,
          ...hashtag,
          lastUpdated: Date.now(),
        });
      } else {
        await ctx.runMutation(internal.tiktok.insertHashtag, {
          ...hashtag,
          lastUpdated: Date.now(),
        });
      }
    }

    // Inserir/atualizar sons em tendência
    for (const sound of mockTrendingSounds) {
      const existing = await ctx.runQuery(internal.tiktok.findSoundById, { soundId: sound.soundId });
      
      if (existing) {
        await ctx.runMutation(internal.tiktok.updateSound, {
          id: existing._id,
          ...sound,
          lastUpdated: Date.now(),
        });
      } else {
        await ctx.runMutation(internal.tiktok.insertSound, {
          ...sound,
          lastUpdated: Date.now(),
        });
      }
    }

    // Gerar recomendações personalizadas
    await ctx.runMutation(internal.tiktok.generateRecommendations, { userId });

    return { success: true, message: "Dados sincronizados com sucesso!" };
  },
});

// Mutations internas para gerenciar dados
export const findHashtagByName = internalQuery({
  args: { hashtag: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trendingHashtags")
      .withIndex("by_hashtag", (q) => q.eq("hashtag", args.hashtag))
      .first();
  },
});

export const updateHashtag = internalMutation({
  args: {
    id: v.id("trendingHashtags"),
    hashtag: v.string(),
    viewCount: v.number(),
    postCount: v.number(),
    engagementRate: v.number(),
    category: v.string(),
    trendScore: v.number(),
    lastUpdated: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const insertHashtag = internalMutation({
  args: {
    hashtag: v.string(),
    viewCount: v.number(),
    postCount: v.number(),
    engagementRate: v.number(),
    category: v.string(),
    trendScore: v.number(),
    lastUpdated: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("trendingHashtags", args);
  },
});

export const findSoundById = internalQuery({
  args: { soundId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trendingSounds")
      .withIndex("by_sound_id", (q) => q.eq("soundId", args.soundId))
      .first();
  },
});

export const updateSound = internalMutation({
  args: {
    id: v.id("trendingSounds"),
    soundId: v.string(),
    title: v.string(),
    artist: v.optional(v.string()),
    duration: v.number(),
    useCount: v.number(),
    trendScore: v.number(),
    category: v.string(),
    lastUpdated: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const insertSound = internalMutation({
  args: {
    soundId: v.string(),
    title: v.string(),
    artist: v.optional(v.string()),
    duration: v.number(),
    useCount: v.number(),
    trendScore: v.number(),
    category: v.string(),
    lastUpdated: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("trendingSounds", args);
  },
});

export const generateRecommendations = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Limpar recomendações antigas
    const oldRecommendations = await ctx.db
      .query("contentRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const rec of oldRecommendations) {
      await ctx.db.delete(rec._id);
    }

    // Gerar novas recomendações baseadas em tendências
    const topHashtags = await ctx.db
      .query("trendingHashtags")
      .withIndex("by_trend_score")
      .order("desc")
      .take(5);

    const topSounds = await ctx.db
      .query("trendingSounds")
      .withIndex("by_trend_score")
      .order("desc")
      .take(3);

    // Recomendações de hashtags
    for (const hashtag of topHashtags) {
      await ctx.db.insert("contentRecommendations", {
        userId: args.userId,
        type: "hashtag",
        content: hashtag.hashtag,
        reason: `Hashtag em alta com ${hashtag.viewCount.toLocaleString()} visualizações e ${hashtag.engagementRate}% de engajamento`,
        trendScore: hashtag.trendScore,
        potentialReach: hashtag.viewCount,
        difficulty: hashtag.postCount > 100000 ? "hard" : hashtag.postCount > 50000 ? "medium" : "easy",
        category: hashtag.category,
        generatedAt: Date.now(),
      });
    }

    // Recomendações de sons
    for (const sound of topSounds) {
      await ctx.db.insert("contentRecommendations", {
        userId: args.userId,
        type: "sound",
        content: sound.title,
        reason: `Som viral usado em ${sound.useCount.toLocaleString()} vídeos`,
        trendScore: sound.trendScore,
        potentialReach: sound.useCount * 1000, // Estimativa
        difficulty: sound.useCount > 50000 ? "hard" : sound.useCount > 20000 ? "medium" : "easy",
        category: sound.category,
        generatedAt: Date.now(),
      });
    }

    // Recomendações de tópicos
    const topicRecommendations = [
      { content: "Desafios de dança", reason: "Conteúdo de dança tem 15% mais engajamento", category: "Dança", trendScore: 88 },
      { content: "Receitas rápidas", reason: "Vídeos de culinária cresceram 25% este mês", category: "Culinária", trendScore: 85 },
      { content: "Transformações", reason: "Before/after tem alta taxa de compartilhamento", category: "Lifestyle", trendScore: 82 },
    ];

    for (const topic of topicRecommendations) {
      await ctx.db.insert("contentRecommendations", {
        userId: args.userId,
        type: "topic",
        content: topic.content,
        reason: topic.reason,
        trendScore: topic.trendScore,
        potentialReach: 500000, // Estimativa
        difficulty: "medium",
        category: topic.category,
        generatedAt: Date.now(),
      });
    }
  },
});
