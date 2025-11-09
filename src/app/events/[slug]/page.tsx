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
import type { EventsApiEventDetail } from "@/server/api/routers/polymarket";
import { api, HydrateClient } from "@/trpc/server";

type Event = EventsApiEventDetail;

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

function HeaderSection({ event }: { event: Event }) {
  const eventImage = event.imageOptimized?.imageUrlOptimized || event.image;
  const primaryTag = event.tags.find((tag) => tag.forceShow) || event.tags[0];

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className={`${
              event.active
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            } border-0 px-3 py-1 font-semibold text-sm`}
          >
            {event.active ? "Active" : "Closed"}
          </Badge>
          {primaryTag && (
            <Badge variant="outline">
              <Tag className="mr-1 h-3 w-3" />
              {primaryTag.label}
            </Badge>
          )}
          {event.category && <Badge variant="outline">{event.category}</Badge>}
        </div>

        {eventImage && (
          <div className="flex items-center gap-4">
            {eventImage && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted/20">
                <OptimizedImage
                  alt="Event media"
                  className="h-full w-full object-cover"
                  height={96}
                  src={eventImage}
                  width={96}
                />
              </div>
            )}
          </div>
        )}

        <div>
          <CardTitle className="font-bold text-4xl leading-tight">
            {event.title}
          </CardTitle>
          {event.subtitle && (
            <CardDescription className="mt-2 text-lg">
              {event.subtitle}
            </CardDescription>
          )}
          {event.description && (
            <CardDescription className="mt-3 text-base">
              {event.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function VolumeLiquiditySection({ event }: { event: Event }) {
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
            {formatVolume(event.volume)}
          </span>
        </div>
        {event.volume24hr !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">24h</span>
            <span className="font-medium">
              {formatVolume(event.volume24hr)}
            </span>
          </div>
        )}
        {event.volume1wk !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">1 Week</span>
            <span className="font-medium">{formatVolume(event.volume1wk)}</span>
          </div>
        )}
        {event.volume1mo !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">1 Month</span>
            <span className="font-medium">{formatVolume(event.volume1mo)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventDetailsSection({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {event.startDate && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Start Date
              </div>
              <span className="font-semibold">
                {new Date(event.startDate).toLocaleString()}
              </span>
            </div>
          )}
          {event.endDate && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                End Date
              </div>
              <span className="font-semibold">
                {new Date(event.endDate).toLocaleString()}
              </span>
            </div>
          )}
          {event.createdAt && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">Created</div>
              <span className="font-semibold">
                {new Date(event.createdAt).toLocaleString()}
              </span>
            </div>
          )}
          {event.resolutionSource && (
            <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">Resolution Source</div>
              <a
                className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                href={event.resolutionSource}
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

function TechnicalInfoSection({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Technical Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Event ID</span>
            <span className="font-mono text-sm">{event.id}</span>
          </div>
          {event.slug && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono text-sm">{event.slug}</span>
            </div>
          )}
          {event.ticker && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Ticker</span>
              <span className="font-mono text-sm">{event.ticker}</span>
            </div>
          )}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
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

function MarketsSection({ event }: { event: Event }) {
  if (!event.markets || event.markets.length === 0) {
    return null;
  }

  const formatVolume = (value: string | number | undefined) => {
    if (value === undefined || value === null) {
      return "N/A";
    }
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;
    if (numValue >= 1_000_000) {
      return `$${(numValue / 1_000_000).toFixed(1)}M`;
    }
    if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}K`;
    }
    return `$${numValue.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-5 w-5" />
          Markets ({event.markets.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {event.markets.map((market) => {
            const outcomes = market.outcomes ? JSON.parse(market.outcomes) : [];
            const outcomePrices = market.outcomePrices
              ? JSON.parse(market.outcomePrices)
              : [];

            return (
              <div
                className="flex flex-col gap-3 rounded-lg border p-4"
                key={market.id}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold leading-tight">
                      {market.question}
                    </h3>
                    {market.description && (
                      <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                        {market.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={
                      market.active
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-rose-500 hover:bg-rose-600"
                    }
                    variant="default"
                  >
                    {market.active ? "Active" : "Closed"}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {outcomes.map((outcome: string, index: number) => {
                    const price = outcomePrices[index] || "0";
                    const isEven = index % 2 === 0;

                    return (
                      <div
                        className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                        key={outcome}
                      >
                        <span className="font-medium text-sm">{outcome}</span>
                        <span
                          className={`font-semibold ${
                            isEven ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {formatCurrency(Number.parseFloat(price))}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Volume: {formatVolume(market.volume)}</span>
                  </div>
                  {market.endDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(market.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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
  const event = await api.polymarket.getEventBySlug({ slug });
  console.log("event", event);

  if (!event) {
    notFound();
  }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button className="mb-6" size="lg" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>

          <div className="space-y-6">
            <HeaderSection event={event} />

            {event.markets && event.markets.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {(() => {
                  // Aggregate data from all markets
                  const allActiveMarkets = event.markets.filter(
                    (m) => m.active
                  );
                  if (allActiveMarkets.length === 0) {
                    return null;
                  }

                  // Calculate average prices and price changes across all markets
                  const totalYesPrices = allActiveMarkets.reduce(
                    (sum, market) => {
                      const prices = market.outcomePrices
                        ? JSON.parse(market.outcomePrices)
                        : [];
                      return sum + (Number.parseFloat(prices[0] || "0") || 0);
                    },
                    0
                  );

                  const totalNoPrices = allActiveMarkets.reduce(
                    (sum, market) => {
                      const prices = market.outcomePrices
                        ? JSON.parse(market.outcomePrices)
                        : [];
                      return sum + (Number.parseFloat(prices[1] || "0") || 0);
                    },
                    0
                  );

                  const avgYesPrice = totalYesPrices / allActiveMarkets.length;
                  const avgNoPrice = totalNoPrices / allActiveMarkets.length;

                  // Calculate average price change
                  const totalPriceChanges = allActiveMarkets.reduce(
                    (sum, market) => sum + (market.oneDayPriceChange || 0),
                    0
                  );
                  const avgPriceChange =
                    totalPriceChanges / allActiveMarkets.length;

                  // Get the most common outcomes (assuming Yes/No)
                  const firstMarket = allActiveMarkets[0];
                  const outcomes = firstMarket?.outcomes
                    ? JSON.parse(firstMarket.outcomes)
                    : [];

                  return (
                    <>
                      <PriceCard
                        change={avgPriceChange}
                        label={`${outcomes[0] || "Yes"} Price (Avg)`}
                        price={avgYesPrice.toString()}
                      />
                      <RosePriceCard
                        label={`${outcomes[1] || "No"} Price (Avg)`}
                        price={avgNoPrice.toString()}
                      />
                    </>
                  );
                })()}
              </div>
            )}

            <VolumeLiquiditySection event={event} />
            <EventDetailsSection event={event} />
            <TechnicalInfoSection event={event} />
            <MarketsSection event={event} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
