import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/form-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layout } from "@/components/layout";
import { analyticsApi } from "@/lib/api";
import { Globe, BarChart3, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function AllAnalytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["all-analytics"],
    queryFn: () => analyticsApi.getAllAnalytics(),
  });

  const analytics = analyticsData?.data || [];

  const groupedByUrl = analytics.reduce((acc, entry) => {
    if (!entry.urlId) return acc;
    if (!acc[entry.urlId]) {
      acc[entry.urlId] = {
        originalUrl: entry.originalUrl || "",
        shortCode: entry.shortCode || "",
        clicks: 0,
        uniqueIps: new Set(),
      };
    }
    acc[entry.urlId].clicks++;
    acc[entry.urlId].uniqueIps.add(entry.ipAddress);
    return acc;
  }, {} as Record<string, { originalUrl: string; shortCode: string; clicks: number; uniqueIps: Set<string> }>);

  const summary = Object.entries(groupedByUrl).map(([urlId, data]) => ({
    urlId,
    ...data,
    uniqueIps: data.uniqueIps.size,
  })).sort((a, b) => b.clicks - a.clicks);

  const topUrlsData = summary.slice(0, 5).map((entry, index) => ({
    name: entry.shortCode,
    clicks: entry.clicks,
    fill: COLORS[index % COLORS.length],
  }));

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Analytics</h1>
          <p className="text-muted-foreground">Overview of all your URLs</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{summary.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{analytics.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {new Set(analytics.map((a) => a.ipAddress)).size}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {topUrlsData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Performing URLs</CardTitle>
              <CardDescription>Top 5 URLs by click count</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={topUrlsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} className="fill-muted-foreground" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    width={80}
                    className="fill-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                    {topUrlsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>URL Performance</CardTitle>
            <CardDescription>Click stats for each URL</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : summary.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No analytics data yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Unique IPs</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.map((entry) => (
                    <TableRow key={entry.urlId}>
                      <TableCell className="max-w-xs truncate" title={entry.originalUrl}>
                        {entry.originalUrl}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-sm">
                          {entry.shortCode}
                        </code>
                      </TableCell>
                      <TableCell>{entry.clicks}</TableCell>
                      <TableCell>{entry.uniqueIps}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/analytics/${entry.urlId}`}>
                          <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
