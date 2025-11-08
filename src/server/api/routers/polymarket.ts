import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const POLYMARKET_API_URL = "https://gamma-api.polymarket.com/markets";

export type PolymarketMarket = {
	id: string;
	question: string;
	clobTokenIds: string; // JSON string containing array
	volume: string; // API returns as string
	volumeNum: number; // API returns as number
	active: boolean;
	closed: boolean;
	endDate: string;
	category: string;
	slug: string;
	outcomePrices: string; // JSON string with ["yesPrice", "noPrice"]
	marketType: string;
	image?: string;
	description?: string;
	conditionId?: string;
	createdAt?: string;
	updatedAt?: string;
	archived?: boolean;
	restricted?: boolean;
	liquidity?: string;
	liquidityNum?: number;
	endDateIso?: string;
	outcomes?: string; // JSON string
	twitterCardImage?: string;
	icon?: string;
	updatedBy?: number;
	marketMakerAddress?: string;
	closedTime?: string;
	mailchimpTag?: string;
	fpmmLive?: boolean;
	ready?: boolean;
	funded?: boolean;
	cyom?: boolean;
	creator?: string;
	approved?: boolean;
	pendingDeployment?: boolean;
	deploying?: boolean;
	events?: any[];
	rewardsMinSize?: number;
	rewardsMaxSpread?: number;
	spread?: number;
	oneDayPriceChange?: number;
	oneHourPriceChange?: number;
	oneWeekPriceChange?: number;
	oneMonthPriceChange?: number;
	oneYearPriceChange?: number;
	lastTradePrice?: number;
	bestBid?: number;
	bestAsk?: number;
	clearBookOnStart?: boolean;
	manualActivation?: boolean;
	negRiskOther?: boolean;
	umaResolutionStatuses?: string;
	rfqEnabled?: boolean;
	holdingRewardsEnabled?: boolean;
	feesEnabled?: boolean;
	pagerDutyNotificationEnabled?: boolean;
	competitive?: number;
	volume24hr?: number;
	volume1wk?: number;
	volume1mo?: number;
	volume1yr?: number;
	volume1wkAmm?: number;
	volume1moAmm?: number;
	volume1yrAmm?: number;
	volume1wkClob?: number;
	volume1moClob?: number;
	volume1yrClob?: number;
	volume24hrNum?: number;
	volume1wkNum?: number;
	volume1moNum?: number;
	volume1yrNum?: number;
	hasReviewedDates?: boolean;
	readyForCron?: boolean;
};

export const polymarketRouter = createTRPCRouter({
	getMarkets: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(50),
				orderBy: z.enum(["volume", "created"]).default("volume"),
				status: z.enum(["active", "resolved", "all"]).default("all"),
			}),
		)
		.query(async ({ input }) => {
			const order = input.orderBy === "volume" ? "-volumeNum" : "-createdAt";

			// Build URL with filters - use 'closed' parameter for server-side filtering when possible
			const params = new URLSearchParams({
				limit: input.limit.toString(),
				order: order,
			});

			// Add closed filter if not 'all'
			if (input.status === "active") {
				params.append("closed", "false");
			} else if (input.status === "resolved") {
				params.append("closed", "true");
			}

			const url = `${POLYMARKET_API_URL}?${params.toString()}`;

			const response = await fetch(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch markets: ${response.statusText}`);
			}

			let data = (await response.json()) as PolymarketMarket[];

			// Client-side filtering as fallback if API parameter doesn't work
			if (input.status === "active") {
				// Filter for markets that are NOT closed
				data = data.filter((market) => !market.closed);
			} else if (input.status === "resolved") {
				// Filter for markets that ARE closed
				data = data.filter((market) => market.closed);
			}

			return data;
		}),

	getTopMarkets: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(50),
			}),
		)
		.query(async ({ input }) => {
			// Fetch top 50 markets sorted by volume (descending) that are not closed
			const params = new URLSearchParams({
				limit: input.limit.toString(),
				order: "-volumeNum",
				closed: "false",
			});

			const url = `${POLYMARKET_API_URL}?${params.toString()}`;

			const response = await fetch(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch top markets: ${response.statusText}`);
			}

			const data = (await response.json()) as PolymarketMarket[];

			return data;
		}),

	getMarketById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const params = new URLSearchParams({
				id: input.id,
			});

			const url = `${POLYMARKET_API_URL}?${params.toString()}`;

			const response = await fetch(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch market: ${response.statusText}`);
			}

			const data = (await response.json()) as PolymarketMarket[];

			if (!data || data.length === 0) {
				throw new Error(`Market with ID ${input.id} not found`);
			}

			return data[0];
		}),
});
