import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const POLYMARKET_API_URL = "https://gamma-api.polymarket.com";

// Types for market detail response
export type ImageOptimized = {
  id: string;
  imageUrlSource: string;
  imageUrlOptimized: string;
  imageSizeKbSource: number;
  imageSizeKbOptimized: number;
  imageOptimizedComplete: boolean;
  imageOptimizedLastUpdated: string;
  relID: number;
  field: string;
  relname: string;
};

export type Chat = {
  id: string;
  channelId: string;
  channelName: string;
  channelImage: string;
  live: boolean;
  startTime: string;
  endTime: string;
};

export type EventCreator = {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorUrl: string;
  creatorImage: string;
  createdAt: string;
  updatedAt: string;
};

export type Template = {
  id: string;
  eventTitle: string;
  eventSlug: string;
  eventImage: string;
  marketTitle: string;
  description: string;
  resolutionSource: string;
  negRisk: boolean;
  sortBy: string;
  showMarketImages: boolean;
  seriesSlug: string;
  outcomes: string;
};

export type Category = {
  id: string;
  label: string;
  parentCategory: string;
  slug: string;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: string;
  label: string;
  slug: string;
  forceShow: boolean;
  publishedAt: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  forceHide: boolean;
  isCarousel: boolean;
};

export type Collection = {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  collectionType: string;
  description: string;
  tags: string;
  image: string;
  icon: string;
  headerImage: string;
  layout: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  isTemplate: boolean;
  templateVariables: string;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  imageOptimized?: ImageOptimized;
  iconOptimized?: ImageOptimized;
  headerImageOptimized?: ImageOptimized;
};

export type Series = {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  seriesType: string;
  recurrence: string;
  description: string;
  image: string;
  icon: string;
  layout: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  isTemplate: boolean;
  templateVariables: boolean;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: string;
  volume24hr: number;
  volume: number;
  liquidity: number;
  startDate: string;
  pythTokenID: string;
  cgAssetName: string;
  score: number;
  events: unknown[];
  collections: Collection[];
  categories: Category[];
  tags: Tag[];
  commentCount: number;
  chats: Chat[];
};

export type Event = {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  resolutionSource: string;
  startDate: string;
  creationDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  sortBy: string;
  category: string;
  subcategory: string;
  isTemplate: boolean;
  templateVariables: string;
  published_at: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  featuredImage: string;
  disqusThread: string;
  parentEvent: string;
  enableOrderBook: boolean;
  liquidityAmm: number;
  liquidityClob: number;
  negRisk: boolean;
  negRiskMarketID: string;
  negRiskFeeBips: number;
  commentCount: number;
  imageOptimized?: ImageOptimized;
  iconOptimized?: ImageOptimized;
  featuredImageOptimized?: ImageOptimized;
  subEvents: string[];
  markets: unknown[];
  series: Series[];
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  cyom: boolean;
  closedTime: string;
  showAllOutcomes: boolean;
  showMarketImages: boolean;
  automaticallyResolved: boolean;
  enableNegRisk: boolean;
  automaticallyActive: boolean;
  eventDate: string;
  startTime: string;
  eventWeek: number;
  seriesSlug: string;
  score: string;
  elapsed: string;
  period: string;
  live: boolean;
  ended: boolean;
  finishedTimestamp: string;
  gmpChartMode: string;
  eventCreators: EventCreator[];
  tweetCount: number;
  chats: Chat[];
  featuredOrder: number;
  estimateValue: boolean;
  cantEstimate: boolean;
  estimatedValue: string;
  templates: Template[];
  spreadsMainLine: number;
  totalsMainLine: number;
  carouselMap: string;
  pendingDeployment: boolean;
  deploying: boolean;
  deployingTimestamp: string;
  scheduledDeploymentTimestamp: string;
  gameStatus: string;
};

export type PolymarketMarketDetail = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage: string;
  resolutionSource: string;
  endDate: string;
  category: string;
  ammType: string;
  liquidity: string;
  sponsorName: string;
  sponsorImage: string;
  startDate: string;
  xAxisValue: string;
  yAxisValue: string;
  denominationToken: string;
  fee: string;
  image: string;
  icon: string;
  lowerBound: string;
  upperBound: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  marketType: string;
  formatType: string;
  lowerBoundDate: string;
  upperBoundDate: string;
  closed: boolean;
  marketMakerAddress: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  closedTime: string;
  wideFormat: boolean;
  new: boolean;
  mailchimpTag: string;
  featured: boolean;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  marketGroup: number;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  umaEndDate: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  umaResolutionStatus: string;
  curationOrder: number;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  umaEndDateIso: string;
  hasReviewedDates: boolean;
  readyForCron: boolean;
  commentsEnabled: boolean;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  gameStartTime: string;
  secondsDelay: number;
  clobTokenIds: string;
  disqusThread: string;
  shortOutcomes: string;
  teamAID: string;
  teamBID: string;
  umaBond: string;
  umaReward: string;
  fpmmLive: boolean;
  volume24hrAmm: number;
  volume1wkAmm: number;
  volume1moAmm: number;
  volume1yrAmm: number;
  volume24hrClob: number;
  volume1wkClob: number;
  volume1moClob: number;
  volume1yrClob: number;
  volumeAmm: number;
  volumeClob: number;
  liquidityAmm: number;
  liquidityClob: number;
  makerBaseFee: number;
  takerBaseFee: number;
  customLiveness: number;
  acceptingOrders: boolean;
  notificationsEnabled: boolean;
  score: number;
  imageOptimized?: ImageOptimized;
  iconOptimized?: ImageOptimized;
  events: Event[];
  categories: Category[];
  tags: Tag[];
  creator: string;
  ready: boolean;
  funded: boolean;
  pastSlugs: string;
  readyTimestamp: string;
  fundedTimestamp: string;
  acceptingOrdersTimestamp: string;
  competitive: number;
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  automaticallyResolved: boolean;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  oneYearPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  chartColor: string;
  seriesColor: string;
  showGmpSeries: boolean;
  showGmpOutcome: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  gameId: string;
  groupItemRange: string;
  sportsMarketType: string;
  line: number;
  umaResolutionStatuses: string;
  pendingDeployment: boolean;
  deploying: boolean;
  deployingTimestamp: string;
  scheduledDeploymentTimestamp: string;
  rfqEnabled: boolean;
  eventStartTime: string;
};

export type PolymarketMarket = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage: string;
  resolutionSource: string;
  endDate: string;
  category: string;
  ammType: string;
  liquidity: string;
  sponsorName: string;
  sponsorImage: string;
  startDate: string;
  xAxisValue: string;
  yAxisValue: string;
  denominationToken: string;
  fee: string;
  image: string;
  icon: string;
  lowerBound: string;
  upperBound: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  marketType: string;
  formatType: string;
  lowerBoundDate: string;
  upperBoundDate: string;
  closed: boolean;
  marketMakerAddress: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  closedTime: string;
  wideFormat: boolean;
  new: boolean;
  mailchimpTag: string;
  featured: boolean;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  marketGroup: number;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  umaEndDate: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  umaResolutionStatus: string;
  curationOrder: number;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  umaEndDateIso: string;
  hasReviewedDates: boolean;
  readyForCron: boolean;
  commentsEnabled: boolean;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  gameStartTime: string;
  secondsDelay: number;
  clobTokenIds: string;
  disqusThread: string;
  shortOutcomes: string;
  teamAID: string;
  teamBID: string;
  umaBond: string;
  umaReward: string;
  fpmmLive: boolean;
  volume24hrAmm: number;
  volume1wkAmm: number;
  volume1moAmm: number;
  volume1yrAmm: number;
  volume24hrClob: number;
  volume1wkClob: number;
  volume1moClob: number;
  volume1yrClob: number;
  volumeAmm: number;
  volumeClob: number;
  liquidityAmm: number;
  liquidityClob: number;
  makerBaseFee: number;
  takerBaseFee: number;
  customLiveness: number;
  acceptingOrders: boolean;
  notificationsEnabled: boolean;
  score: number;
  imageOptimized?: ImageOptimized;
  iconOptimized?: ImageOptimized;
  events: Event[];
  categories: Category[];
  tags: Tag[];
  creator: string;
  ready: boolean;
  funded: boolean;
  pastSlugs: string;
  readyTimestamp: string;
  fundedTimestamp: string;
  acceptingOrdersTimestamp: string;
  competitive: number;
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  automaticallyResolved: boolean;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  oneYearPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  chartColor: string;
  seriesColor: string;
  showGmpSeries: boolean;
  showGmpOutcome: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  gameId: string;
  groupItemRange: string;
  sportsMarketType: string;
  line: number;
  umaResolutionStatuses: string;
  pendingDeployment: boolean;
  deploying: boolean;
  deployingTimestamp: string;
  scheduledDeploymentTimestamp: string;
  rfqEnabled: boolean;
  eventStartTime: string;
};

export const polymarketRouter = createTRPCRouter({
  getMarkets: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        orderBy: z.enum(["volume", "created"]).default("volume"),
        closed: z.boolean().optional().default(false),
        competitive: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const order = input.orderBy === "volume" ? "-volumeNum" : "-createdAt";

      // Build URL with filters - use 'closed' parameter for server-side filtering when possible
      const params = new URLSearchParams({
        limit: input.limit.toString(),
        order,
      });

      // Add closed filter if specified
      if (typeof input.closed === "boolean") {
        params.append("closed", String(input.closed));
      }

      if (input.competitive !== undefined) {
        params.append("competitive", input.competitive.toString());
      }

      const url = `${POLYMARKET_API_URL}/markets?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch markets: ${response.statusText}`);
      }

      const data = (await response.json()) as PolymarketMarket[];

      return data;
    }),

  getMarketBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = `${POLYMARKET_API_URL}/markets/slug/${input.slug}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch market: ${response.statusText}`);
      }

      const data = (await response.json()) as PolymarketMarketDetail;

      return data;
    }),
});
