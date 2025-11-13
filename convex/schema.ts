import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tiktokAccounts: defineTable({
    userId: v.id("users"),
    clientKey: v.string(),
    clientSecret: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    tiktokUserId: v.optional(v.string()),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    followerCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
    likesCount: v.optional(v.number()),
    videoCount: v.optional(v.number()),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),

  trendingHashtags: defineTable({
    hashtag: v.string(),
    viewCount: v.number(),
    postCount: v.number(),
    engagementRate: v.number(),
    category: v.string(),
    region: v.optional(v.string()),
    trendScore: v.number(),
    lastUpdated: v.number(),
  }).index("by_trend_score", ["trendScore"])
    .index("by_category", ["category"])
    .index("by_hashtag", ["hashtag"]),

  trendingSounds: defineTable({
    soundId: v.string(),
    title: v.string(),
    artist: v.optional(v.string()),
    duration: v.number(),
    useCount: v.number(),
    trendScore: v.number(),
    category: v.string(),
    lastUpdated: v.number(),
  }).index("by_trend_score", ["trendScore"])
    .index("by_sound_id", ["soundId"])
    .index("by_category", ["category"]),

  userVideos: defineTable({
    userId: v.id("users"),
    tiktokVideoId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    viewCount: v.number(),
    likeCount: v.number(),
    commentCount: v.number(),
    shareCount: v.number(),
    playTime: v.number(),
    hashtags: v.array(v.string()),
    soundId: v.optional(v.string()),
    publishTime: v.number(),
    engagementRate: v.number(),
    performance: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("average"),
      v.literal("poor")
    ),
  }).index("by_user", ["userId"])
    .index("by_performance", ["performance"])
    .index("by_engagement", ["engagementRate"]),

  contentRecommendations: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("hashtag"), v.literal("sound"), v.literal("topic")),
    content: v.string(),
    reason: v.string(),
    trendScore: v.number(),
    potentialReach: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(),
    generatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_trend_score", ["trendScore"]),

  analyticsReports: defineTable({
    userId: v.id("users"),
    reportType: v.union(
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("trend_analysis")
    ),
    data: v.object({
      totalViews: v.number(),
      totalLikes: v.number(),
      totalComments: v.number(),
      totalShares: v.number(),
      avgEngagementRate: v.number(),
      topPerformingVideo: v.optional(v.string()),
      growthRate: v.number(),
      bestPostingTimes: v.array(v.number()),
      topHashtags: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    generatedAt: v.number(),
    periodStart: v.number(),
    periodEnd: v.number(),
  }).index("by_user", ["userId"])
    .index("by_type", ["reportType"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
