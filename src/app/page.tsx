import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LatestPost } from "@/app/_components/post";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });
	const session = await getSession();

	// Prefetch the top 50 active Polymarket markets
	const markets = await api.polymarket.getTopMarkets({
		limit: 50,
		status: "active",
	});

	if (session) {
		void api.post.getLatest.prefetch();
	}

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Active <span className="text-[hsl(280,100%,70%)]">Markets</span>
					</h1>
					<p className="text-xl text-white/80">
						Currently trading - Sorted by Volume
					</p>

					<div className="w-full max-w-6xl">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{markets.map((market, index) => {
								// Parse outcomePrices JSON string
								const outcomePrices = market.outcomePrices ? JSON.parse(market.outcomePrices) : ["0", "0"];
								const yesPrice = outcomePrices[0] || "0";
								const noPrice = outcomePrices[1] || "0";

								return (
									<Link href={`/markets/${market.id}`} key={market.id ?? index}>
										<Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
											<CardHeader>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1">
														<CardTitle className="text-lg line-clamp-2">
															{market.question}
														</CardTitle>
														<CardDescription className="text-white/70 mt-1">
															{market.category}
														</CardDescription>
													</div>
													<Badge
														variant={market.active ? "default" : "secondary"}
														className={
															market.active ? "bg-green-500 hover:bg-green-600" : ""
														}
													>
														{market.active ? "Active" : "Closed"}
													</Badge>
												</div>
											</CardHeader>
											<CardContent className="space-y-3">
												<div className="flex justify-between items-center">
													<span className="text-sm text-white/70">Volume</span>
													<span className="font-semibold">
														${(market.volumeNum / 1_000_000).toFixed(2)}M
													</span>
												</div>

												<div className="flex justify-between items-center">
													<span className="text-sm text-white/70">Yes Price</span>
													<span className="font-semibold text-green-400">
														${parseFloat(yesPrice).toFixed(2)}
													</span>
												</div>

												<div className="flex justify-between items-center">
													<span className="text-sm text-white/70">No Price</span>
													<span className="font-semibold text-red-400">
														${parseFloat(noPrice).toFixed(2)}
													</span>
												</div>

												{market.endDate && (
													<div className="flex justify-between items-center">
														<span className="text-sm text-white/70">Ends</span>
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
							<Button
								variant="outline"
								size="lg"
								className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
							>
								View Resolved Markets
							</Button>
						</Link>
					</div>

					<div className="flex flex-col items-center gap-2">
						<p className="text-2xl text-white">
							{hello ? hello.greeting : "Loading tRPC query..."}
						</p>

						<div className="flex flex-col items-center justify-center gap-4">
							<p className="text-center text-2xl text-white">
								{session && <span>Logged in as {session.user?.name}</span>}
							</p>
							{!session ? (
								<form>
									<Button
										className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
										formAction={async () => {
											"use server";
											const res = await auth.api.signInSocial({
												body: {
													provider: "github",
													callbackURL: "/",
												},
											});
											if (!res.url) {
												throw new Error("No URL returned from signInSocial");
											}
											redirect(res.url);
										}}
										size="lg"
										variant="outline"
									>
										Sign in with Github
									</Button>
								</form>
							) : (
								<form>
									<Button
										className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
										formAction={async () => {
											"use server";
											await auth.api.signOut({
												headers: await headers(),
											});
											redirect("/");
										}}
										size="lg"
										variant="outline"
									>
										Sign out
									</Button>
								</form>
							)}
						</div>
					</div>

					{session?.user && <LatestPost />}
				</div>
			</main>
		</HydrateClient>
	);
}
