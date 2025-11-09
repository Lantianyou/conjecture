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
  const events = await api.polymarket.getEvents({
    limit: 50,
  });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const markets = event.markets || [];
                const primaryTag =
                  event.tags.find((tag) => tag.forceShow) || event.tags[0];
                const category = primaryTag?.label || "General";
                return (
                  <Link href={`/events/${event.slug}`} key={event.id}>
                    <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            {event.icon && (
                              <OptimizedImage
                                alt={event.title}
                                className="h-10 w-10 shrink-0 rounded-md object-cover"
                                height={40}
                                src={event.icon}
                                width={40}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <CardTitle className="line-clamp-2 font-medium text-base">
                                {event.title}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs">
                                {category}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            className={
                              event.active
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                            variant={event.active ? "default" : "secondary"}
                          >
                            {event.active ? "Active" : "Closed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Volume
                          </span>
                          <span className="font-semibold">
                            ${(event.volume / 1_000_000).toFixed(2)}M
                          </span>
                        </div>
                        {markets.map((market) => {
                          const outcomePrices = market.outcomePrices
                            ? JSON.parse(market.outcomePrices)
                            : [];

                          return (
                            <div className="space-y-2" key={market.id}>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-muted-foreground text-sm">
                                  {market.question}
                                </span>
                                {market.active ? (
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`font-semibold ${"text-emerald-600"}`}
                                    >
                                      {(
                                        Number.parseFloat(outcomePrices[0]) *
                                        100
                                      ).toFixed(0)}
                                      %
                                    </span>
                                  </div>
                                ) : (
                                  <Badge
                                    className="bg-rose-500 hover:bg-rose-600"
                                    variant="default"
                                  >
                                    Closed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
