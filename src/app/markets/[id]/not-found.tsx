import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<div className="text-center space-y-6">
					<AlertCircle className="mx-auto h-24 w-24 text-white/50" />
					<h1 className="font-extrabold text-6xl tracking-tight sm:text-[5rem]">
						404
					</h1>
					<h2 className="text-3xl font-semibold">Market Not Found</h2>
					<p className="text-xl text-white/80 max-w-2xl">
						The market you're looking for doesn't exist or has been removed.
					</p>
					<Link href="/">
						<Button
							variant="outline"
							size="lg"
							className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white mt-8"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Markets
						</Button>
					</Link>
				</div>
			</div>
		</main>
	);
}
