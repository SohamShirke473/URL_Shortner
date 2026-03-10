import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui/form-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layout } from "@/components/layout";
import { urlApi, type Url } from "@/lib/api";
import { Copy, MoreHorizontal, BarChart3, Trash2, ExternalLink, Edit } from "lucide-react";

const urlSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

type UrlForm = z.infer<typeof urlSchema>;

export function Dashboard() {
  const queryClient = useQueryClient();
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);

  const { data: urlsData, isLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: () => urlApi.getUrls(),
  });

  const createMutation = useMutation({
    mutationFn: (data: UrlForm) => urlApi.createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL created successfully");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create URL");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => urlApi.deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete URL");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UrlForm }) => urlApi.updateUrl(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL updated successfully");
      setEditingUrl(null);
      editForm.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update URL");
    },
  });

  const form = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const editForm = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onCreateSubmit = (data: UrlForm) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UrlForm) => {
    if (editingUrl) {
      updateMutation.mutate({ id: editingUrl.id, data });
    }
  };

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`);
    toast.success("Copied to clipboard");
  };

  const urls = urlsData?.data || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your shortened URLs</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Short URL</CardTitle>
            <CardDescription>Enter a URL to shorten</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onCreateSubmit)} className="flex gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="https://example.com/very-long-url" 
                  {...form.register("url")} 
                />
                {form.formState.errors.url && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.url.message}</p>
                )}
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Shorten"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>List of all your shortened URLs</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : urls.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No URLs yet. Create your first short URL above!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell className="max-w-xs truncate" title={url.url}>
                        {url.url}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-sm">
                            {url.short_code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(url.short_code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <a
                            href={`http://localhost:3000/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(url.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/analytics/${url.id}`} className="flex items-center w-full">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingUrl(url)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteMutation.mutate(url.id)}
                              className="text-destructive"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {editingUrl && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit URL</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Original URL</label>
                    <Input {...editForm.register("url")} />
                    {editForm.formState.errors.url && (
                      <p className="text-xs text-destructive">{editForm.formState.errors.url.message}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingUrl(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
