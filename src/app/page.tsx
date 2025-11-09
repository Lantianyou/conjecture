import Link from "next/link";
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
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const markets = await api.polymarket.getMarkets({
    limit: 50,
  });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {markets.map((market) => {
                const outcomes = market.outcomes
                  ? JSON.parse(market.outcomes)
                  : [];
                const outcomePrices = market.outcomePrices
                  ? JSON.parse(market.outcomePrices)
                  : [];

                return (
                  <Link href={`/markets/${market.slug}`} key={market.id}>
                    <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            {market.icon && (
                              <OptimizedImage
                                alt={market.question}
                                className="h-10 w-10 shrink-0 rounded-md object-cover"
                                height={40}
                                src={market.icon}
                                width={40}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <CardTitle className="line-clamp-2 font-medium text-base">
                                {market.question}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs">
                                {market.category}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            className={
                              market.active
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                            variant={market.active ? "default" : "secondary"}
                          >
                            {market.active ? "Active" : "Closed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Volume
                          </span>
                          <span className="font-semibold">
                            ${(market.volumeNum / 1_000_000).toFixed(2)}M
                          </span>
                        </div>

                        {outcomes.map((outcome: string, index: number) => {
                          const price = outcomePrices[index] || "0";
                          const isEven = index % 2 === 0;

                          return (
                            <div
                              className="flex items-center justify-between"
                              key={outcome}
                            >
                              <span className="text-muted-foreground text-sm">
                                {outcome} Price
                              </span>
                              <span
                                className={`font-semibold ${
                                  isEven ? "text-emerald-600" : "text-rose-600"
                                }`}
                              >
                                ${Number.parseFloat(price).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}

                        {market.endDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                              Ends
                            </span>
                            <span className="text-sm">
                              {new Date(market.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/resolved">
              <Button size="lg" variant="outline">
                View Resolved Markets
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
