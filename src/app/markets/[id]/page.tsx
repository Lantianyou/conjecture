import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const market = await api.polymarket.getMarketById({ id });

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Link href="/">
            <Button
              className="absolute top-4 left-4 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              size="lg"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Markets
            </Button>
          </Link>

          <div className="w-full max-w-4xl">
            <Card className="border-white/20 bg-white/10 text-white">
              <CardHeader>
                <div className="mb-4 flex items-start justify-between gap-2">
                  <Badge
                    className={
                      market.active ? "bg-green-500 hover:bg-green-600" : ""
                    }
                    variant={market.active ? "default" : "secondary"}
                  >
                    {market.active ? "Active" : "Closed"}
                  </Badge>
                  {market.category && (
                    <Badge
                      className="border-white/20 text-white/80"
                      variant="outline"
                    >
                      {market.category}
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-bold text-3xl leading-tight">
                  {market.question}
                </CardTitle>
                {market.description && (
                  <CardDescription className="mt-4 text-lg text-white/70">
                    {market.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Price Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-2xl">Current Prices</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                      <div className="mb-2 text-sm text-white/70">
                        {outcomes[0] || "Yes"} Price
                      </div>
                      <div className="font-bold text-4xl text-green-400">
                        ${Number.parseFloat(yesPrice).toFixed(3)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                      <div className="mb-2 text-sm text-white/70">
                        {outcomes[1] || "No"} Price
                      </div>
                      <div className="font-bold text-4xl text-red-400">
                        ${Number.parseFloat(noPrice).toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Statistics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-2xl">Market Statistics</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-white/70">Volume</div>
                      <div className="font-semibold text-2xl">
                        ${(market.volumeNum / 1_000_000).toFixed(2)}M
                      </div>
                    </div>
                    {market.liquidityNum !== undefined && (
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="text-sm text-white/70">Liquidity</div>
                        <div className="font-semibold text-2xl">
                          ${(market.liquidityNum / 1_000_000).toFixed(2)}M
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Market Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-2xl">Market Details</h3>
                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-6">
                    {market.endDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">End Date</span>
                        <span className="font-semibold">
                          {new Date(market.endDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {market.endDateIso && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">End Date (ISO)</span>
                        <span className="font-semibold">
                          {new Date(market.endDateIso).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {market.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Created</span>
                        <span className="font-semibold">
                          {new Date(market.createdAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Market Type</span>
                      <span className="font-semibold capitalize">
                        {market.marketType || "Standard"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Market ID</span>
                      <span className="font-mono text-sm">{market.id}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {market.slug && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-2xl">
                      Additional Information
                    </h3>
                    <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Slug</span>
                        <span className="font-mono text-sm">{market.slug}</span>
                      </div>
                      {market.conditionId && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Condition ID</span>
                          <span className="font-mono text-sm">
                            {market.conditionId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
