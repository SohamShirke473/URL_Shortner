import { Link } from "react-router-dom";
import { Button } from "@/components/ui/form-elements";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { Link as LinkIcon, BarChart3, Zap, ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center gap-16 px-4 py-16">
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Shorten Your Links,<br />
            <span className="text-primary">Track Your Clicks</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A simple and powerful URL shortener with detailed analytics.
            Create short links, track clicks, and understand your audience.
          </p>
          <div className="flex gap-4">
            <Link to="/register">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <LinkIcon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Easy Shortening</CardTitle>
              <CardDescription>
                Simply paste your long URL and get a short link instantly.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Track clicks, referrers, and user locations with detailed insights.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Fast & Reliable</CardTitle>
              <CardDescription>
                Lightning-fast redirects with 99.9% uptime guarantee.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="text-center text-muted-foreground text-sm">
          <p>Press <kbd className="px-2 py-1 rounded bg-muted text-xs">D</kbd> to toggle dark mode</p>
        </section>
      </div>
    </Layout>
  );
}
