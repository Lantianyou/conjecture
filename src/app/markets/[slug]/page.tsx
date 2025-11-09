import {
  Activity,
  ArrowLeft,
  BarChart3,
  Clock,
  DollarSign,
  ExternalLink,
  Info,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OptimizedImage } from "@/components/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PolymarketMarketDetail } from "@/server/api/routers/polymarket";
import { api, HydrateClient } from "@/trpc/server";

type Market = PolymarketMarketDetail;

// Currency formatter using Intl API
const formatCurrency = (value: number, decimals = 3): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

// Helper component for displaying a price with optional change indicator
function PriceCard({
  label,
  price,
  change,
}: {
  label: string;
  price: string;
  change: number | undefined;
  color: "emerald" | "rose";
}) {
  const formatPriceChange = (changeValue: number | undefined) => {
    if (changeValue === undefined || changeValue === null) {
      return null;
    }
    const isPositive = changeValue >= 0;
    const formatted = `${isPositive ? "+" : ""}${changeValue.toFixed(2)}%`;
    return { value: formatted, isPositive };
  };

  const priceChange = formatPriceChange(change);

  return (
    <Card className="border-emerald-200">
      <CardContent className="pt-6">
        <div className="mb-2 font-medium text-muted-foreground text-sm">
          {label}
        </div>
        <div className="flex items-baseline gap-3">
          <div className="font-bold text-5xl text-emerald-400">
            {formatCurrency(Number.parseFloat(price))}
          </div>
          {priceChange && (
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 font-semibold text-sm ${
                priceChange.isPositive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {priceChange.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {priceChange.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RosePriceCard({ label, price }: { label: string; price: string }) {
  return (
    <Card className="border-rose-200">
      <CardContent className="pt-6">
        <div className="mb-2 font-medium text-muted-foreground text-sm">
          {label}
        </div>
        <div className="flex items-baseline gap-3">
          <div className="font-bold text-5xl text-rose-400">
            {formatCurrency(Number.parseFloat(price))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for stat cards
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "emerald" | "rose" | "blue" | "white";
}) {
  const colorClasses = {
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    blue: "text-blue-600",
    white: "text-foreground",
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className={`mt-1 font-semibold text-2xl ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  );
}

function HeaderSection({ market }: { market: Market }) {
  const marketImage = market.imageOptimized?.imageUrlOptimized || market.image;
  const marketIcon = market.iconOptimized?.imageUrlOptimized || market.icon;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className={`${
              market.active
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            } border-0 px-3 py-1 font-semibold text-sm`}
          >
            {market.active ? "Active" : "Closed"}
          </Badge>
          {market.category && (
            <Badge variant="outline">
              <Tag className="mr-1 h-3 w-3" />
              {market.category}
            </Badge>
          )}
          {market.ammType && <Badge variant="outline">{market.ammType}</Badge>}
        </div>

        {(marketImage || marketIcon) && (
          <div className="flex items-center gap-4">
            {marketIcon && (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted/20">
                <OptimizedImage
                  alt="Market icon"
                  className="h-full w-full object-cover"
                  height={64}
                  src={marketIcon}
                  width={64}
                />
              </div>
            )}
            {marketImage && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted/20">
                <OptimizedImage
                  alt="Market media"
                  className="h-full w-full object-cover"
                  height={96}
                  src={marketImage}
                  width={96}
                />
              </div>
            )}
          </div>
        )}

        <div>
          <CardTitle className="font-bold text-4xl leading-tight">
            {market.question}
          </CardTitle>
          {market.description && (
            <CardDescription className="mt-3 text-base">
              {market.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function TradingInfoSection({ market }: { market: Market }) {
  if (
    market.bestBid === undefined &&
    market.bestAsk === undefined &&
    market.spread === undefined
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-5 w-5" />
          Trading Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {market.bestBid !== undefined && (
            <StatCard
              color="emerald"
              label="Best Bid"
              value={formatCurrency(market.bestBid)}
            />
          )}
          {market.bestAsk !== undefined && (
            <StatCard
              color="rose"
              label="Best Ask"
              value={formatCurrency(market.bestAsk)}
            />
          )}
          {market.spread !== undefined && (
            <StatCard
              color="blue"
              label="Spread"
              value={formatCurrency(market.spread)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VolumeLiquiditySection({
  market,
}: {
  market: PolymarketMarketDetail;
}) {
  const formatVolume = (value: number | undefined, decimals = 2) => {
    if (value === undefined || value === null) {
      return "N/A";
    }
    if (value >= 1_000_000_000) {
      return `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 1_000_000_000)}B`;
    }
    if (value >= 1_000_000) {
      return `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 1_000_000)}M`;
    }
    if (value >= 1000) {
      return `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 1000)}K`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5" />
            Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-xl">
              {formatVolume(market.volumeNum)}
            </span>
          </div>
          {market.volume24hr !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">24h</span>
              <span className="font-medium">
                {formatVolume(market.volume24hr)}
              </span>
            </div>
          )}
          {market.volume1wk !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">1 Week</span>
              <span className="font-medium">
                {formatVolume(market.volume1wk)}
              </span>
            </div>
          )}
          {market.volume1mo !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">1 Month</span>
              <span className="font-medium">
                {formatVolume(market.volume1mo)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" />
            Liquidity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {market.liquidityNum !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-xl">
                {formatVolume(market.liquidityNum)}
              </span>
            </div>
          )}
          {market.liquidityAmm !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">AMM</span>
              <span className="font-medium">
                {formatVolume(market.liquidityAmm)}
              </span>
            </div>
          )}
          {market.liquidityClob !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CLOB</span>
              <span className="font-medium">
                {formatVolume(market.liquidityClob)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PriceChangesSection({ market }: { market: PolymarketMarketDetail }) {
  const shouldShow =
    market.oneHourPriceChange !== undefined ||
    market.oneDayPriceChange !== undefined ||
    market.oneWeekPriceChange !== undefined ||
    market.oneMonthPriceChange !== undefined;

  if (!shouldShow) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-5 w-5" />
          Price Changes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {market.oneHourPriceChange !== undefined && (
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-sm">1 Hour</div>
              <div
                className={`mt-1 font-semibold text-xl ${
                  market.oneHourPriceChange >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {market.oneHourPriceChange >= 0
                  ? `+${market.oneHourPriceChange.toFixed(2)}%`
                  : `${market.oneHourPriceChange.toFixed(2)}%`}
              </div>
            </div>
          )}
          {market.oneDayPriceChange !== undefined && (
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-sm">1 Day</div>
              <div
                className={`mt-1 font-semibold text-xl ${
                  market.oneDayPriceChange >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {market.oneDayPriceChange >= 0
                  ? `+${market.oneDayPriceChange.toFixed(2)}%`
                  : `${market.oneDayPriceChange.toFixed(2)}%`}
              </div>
            </div>
          )}
          {market.oneWeekPriceChange !== undefined && (
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-sm">1 Week</div>
              <div
                className={`mt-1 font-semibold text-xl ${
                  market.oneWeekPriceChange >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {market.oneWeekPriceChange >= 0
                  ? `+${market.oneWeekPriceChange.toFixed(2)}%`
                  : `${market.oneWeekPriceChange.toFixed(2)}%`}
              </div>
            </div>
          )}
          {market.oneMonthPriceChange !== undefined && (
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-sm">1 Month</div>
              <div
                className={`mt-1 font-semibold text-xl ${
                  market.oneMonthPriceChange >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {market.oneMonthPriceChange >= 0
                  ? `+${market.oneMonthPriceChange.toFixed(2)}%`
                  : `${market.oneMonthPriceChange.toFixed(2)}%`}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MarketDetailsSection({ market }: { market: PolymarketMarketDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5" />
          Market Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {market.endDate && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                End Date
              </div>
              <span className="font-semibold">
                {new Date(market.endDate).toLocaleString()}
              </span>
            </div>
          )}
          {market.createdAt && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">Created</div>
              <span className="font-semibold">
                {new Date(market.createdAt).toLocaleString()}
              </span>
            </div>
          )}
          {market.marketType && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">Market Type</div>
              <span className="font-semibold capitalize">
                {market.marketType}
              </span>
            </div>
          )}
          {market.resolutionSource && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">Resolution Source</div>
              <a
                className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                href={market.resolutionSource}
                rel="noopener noreferrer"
                target="_blank"
              >
                Source
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TechnicalInfoSection({ market }: { market: PolymarketMarketDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Technical Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Market ID</span>
            <span className="font-mono text-sm">{market.id}</span>
          </div>
          {market.slug && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono text-sm">{market.slug}</span>
            </div>
          )}
          {market.conditionId && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Condition ID</span>
              <span className="font-mono text-sm">{market.conditionId}</span>
            </div>
          )}
          {market.tags && market.tags.length > 0 && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <Badge className="text-xs" key={tag.id} variant="outline">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedEventsSection({ market }: { market: PolymarketMarketDetail }) {
  if (!market.events || market.events.length === 0) {
    return null;
  }

  const formatVolume = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return "N/A";
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Activity className="h-5 w-5" />
          Related Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {market.events.map((event) => {
            const eventImage =
              event.imageOptimized?.imageUrlOptimized || event.image;
            const eventIcon =
              event.iconOptimized?.imageUrlOptimized || event.icon;

            return (
              <div
                className="flex flex-col overflow-hidden rounded-lg border"
                key={event.id}
              >
                {(eventImage || eventIcon) && (
                  <div className="relative h-32 w-full bg-muted/20">
                    {eventImage ? (
                      <OptimizedImage
                        alt="Event media"
                        className="h-full w-full object-cover"
                        height={128}
                        src={eventImage}
                        width={300}
                      />
                    ) : (
                      eventIcon && (
                        <div className="flex h-full w-full items-center justify-center bg-muted/30">
                          <OptimizedImage
                            alt="Event icon"
                            className="h-12 w-12 object-cover"
                            height={48}
                            src={eventIcon}
                            width={48}
                          />
                        </div>
                      )
                    )}
                    {!event.active && (
                      <Badge className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600">
                        Closed
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div>
                    <h3 className="font-semibold leading-tight">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="mt-1 text-muted-foreground text-sm">
                        {event.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Volume: {formatVolume(event.volume)}</span>
                    </div>
                    {event.endDate && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="truncate">
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = await api.polymarket.getMarketBySlug({ slug });
  console.log("market", market);

  if (!market) {
    notFound();
  }

  // Parse outcome prices
  const outcomePrices = market.outcomePrices
    ? JSON.parse(market.outcomePrices)
    : ["0", "0"];
  const yesPrice = outcomePrices[0] || "0";
  const noPrice = outcomePrices[1] || "0";

  // Parse outcomes
  const outcomes = market.outcomes
    ? JSON.parse(market.outcomes)
    : ["Yes", "No"];

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button className="mb-6" size="lg" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Markets
            </Button>
          </Link>

          <div className="space-y-6">
            <HeaderSection market={market} />

            <div className="grid gap-4 md:grid-cols-2">
              <PriceCard
                change={market.oneDayPriceChange}
                color="emerald"
                label={`${outcomes[0] || "Yes"} Price`}
                price={yesPrice}
              />
              <RosePriceCard
                label={`${outcomes[1] || "No"} Price`}
                price={noPrice}
              />
            </div>

            <TradingInfoSection market={market} />
            <VolumeLiquiditySection market={market} />
            <PriceChangesSection market={market} />
            <MarketDetailsSection market={market} />
            <TechnicalInfoSection market={market} />
            <RelatedEventsSection market={market} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
