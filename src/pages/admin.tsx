import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  FolderOpen,
  Globe,
  Home,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface RevalidationResult {
  success: boolean;
  message: string;
  paths?: string[];
  error?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [specificUrl, setSpecificUrl] = useState("");
  const [customPaths, setCustomPaths] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: RevalidationResult }>(
    {},
  );
  // Indexing states
  const [indexingUrl, setIndexingUrl] = useState("");
  const [indexingUrls, setIndexingUrls] = useState("");
  const [indexingResults, setIndexingResults] = useState<{
    [key: string]: any;
  }>({});
  const [categoryPaths, setCategoryPaths] = useState<string[]>([
    "/category/blogs-news",
    "/category/opportunities",
    "/category/resources",
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const router = useRouter();

  // Fetch categories from Contentful
  useEffect(() => {
    if (isAuthenticated) {
      refreshCategories();
    }
  }, [isAuthenticated]);

  const handleAuth = async () => {
    if (!password) return;

    setLoading("auth");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      alert("Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  const handleRevalidation = async (type: string, paths?: string[]) => {
    setLoading(type);
    try {
      const response = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          specificUrl: specificUrl || undefined,
          customPaths: customPaths
            ? customPaths.split("\n").filter((p) => p.trim())
            : undefined,
          paths,
        }),
      });

      const result = await response.json();
      setResults((prev) => ({ ...prev, [type]: result }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [type]: {
          success: false,
          message: "Failed to revalidate",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const handleIndexing = async (action: string) => {
    setLoading(action);
    try {
      const body: any = { action };

      if (action === "single-url") {
        body.url = indexingUrl;
      } else if (action === "bulk-urls") {
        body.urls = indexingUrls.split("\n").filter((url) => url.trim());
      }

      const apiPath =
        action === "revalidate-sitemap"
          ? "/api/admin/sitemap"
          : "/api/admin/indexing";

      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setIndexingResults((prev) => ({ ...prev, [action]: result }));
    } catch (error) {
      setIndexingResults((prev) => ({
        ...prev,
        [action]: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const refreshCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("/api/admin/categories");
      const data = await response.json();

      console.log(data, "Fetched categories:");

      if (data.success && data.categories) {
        setCategoryPaths(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="h-6 w-6" />
              Admin Access
            </CardTitle>
            <CardDescription>
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Enter admin password"
              />
            </div>
            <Button
              onClick={handleAuth}
              disabled={!password || loading === "auth"}
              className="w-full"
            >
              {loading === "auth" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(categoryPaths);

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage site revalidation, cache clearing, and Google indexing
          </p>
        </div>

        <Tabs defaultValue="revalidation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="revalidation"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Site Revalidation
            </TabsTrigger>
            <TabsTrigger value="indexing" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Google Indexing
            </TabsTrigger>
          </TabsList>

          {/* Revalidation Tab */}
          <TabsContent value="revalidation" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Homepage Revalidation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Homepage Revalidation
                  </CardTitle>
                  <CardDescription>
                    Revalidate the homepage and main navigation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleRevalidation("homepage")}
                    disabled={loading === "homepage"}
                    className="w-full"
                  >
                    {loading === "homepage" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Revalidate Homepage
                      </>
                    )}
                  </Button>
                  {results.homepage && (
                    <Alert
                      className={`mt-4 ${results.homepage.success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {results.homepage.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          {results.homepage.message}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Specific URL Revalidation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Specific URL Revalidation
                  </CardTitle>
                  <CardDescription>
                    Revalidate a specific article or page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specificUrl">URL or Slug</Label>
                    <Input
                      id="specificUrl"
                      value={specificUrl}
                      onChange={(e) => setSpecificUrl(e.target.value)}
                      placeholder="e.g., /article-slug or https://example.com/article"
                    />
                  </div>
                  <Button
                    onClick={() => handleRevalidation("specific")}
                    disabled={!specificUrl || loading === "specific"}
                    className="w-full"
                  >
                    {loading === "specific" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Revalidate URL
                      </>
                    )}
                  </Button>
                  {results.specific && (
                    <Alert
                      className={`mt-4 ${results.specific.success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {results.specific.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          {results.specific.message}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Category Revalidation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Category Pages
                  </CardTitle>
                  <CardDescription>
                    Revalidate all category pages from Contentful
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      {categoriesLoading ? (
                        "Loading categories..."
                      ) : (
                        <>
                          Found {categoryPaths.length} categories:{" "}
                          {categoryPaths
                            .map((path) => path.split("/").pop())
                            .join(", ")}
                        </>
                      )}
                    </div>
                    <Button
                      onClick={refreshCategories}
                      disabled={categoriesLoading}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      {categoriesLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() =>
                      handleRevalidation("categories", categoryPaths)
                    }
                    disabled={loading === "categories" || categoriesLoading}
                    className="w-full"
                  >
                    {loading === "categories" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Revalidate Categories
                      </>
                    )}
                  </Button>
                  {results.categories && (
                    <Alert
                      className={`mt-4 ${results.categories.success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {results.categories.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          {results.categories.message}
                          {results.categories.paths && (
                            <div className="mt-2 text-xs">
                              Revalidated: {results.categories.paths.join(", ")}
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Custom Paths Revalidation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Custom Paths
                  </CardTitle>
                  <CardDescription>
                    Revalidate multiple custom paths (one per line)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customPaths">Paths to Revalidate</Label>
                    <Textarea
                      id="customPaths"
                      value={customPaths}
                      onChange={(e) => setCustomPaths(e.target.value)}
                      placeholder={`/\n/about-us\n/contact-us\n/article-slug-1\n/article-slug-2`}
                      rows={5}
                    />
                  </div>
                  <Button
                    onClick={() => handleRevalidation("custom")}
                    disabled={!customPaths.trim() || loading === "custom"}
                    className="w-full"
                  >
                    {loading === "custom" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Revalidate Custom Paths
                      </>
                    )}
                  </Button>
                  {results.custom && (
                    <Alert
                      className={`mt-4 ${results.custom.success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {results.custom.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          {results.custom.message}
                          {results.custom.paths && (
                            <div className="mt-2 text-xs">
                              Revalidated: {results.custom.paths.join(", ")}
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Google Indexing Tab */}
          <TabsContent value="indexing" className="mt-6">
            <div className="grid gap-6">
              {/* Sitemap Revalidation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Sitemap Management
                  </CardTitle>
                  <CardDescription>
                    Revalidate sitemap.xml and notify search engines about
                    updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleIndexing("revalidate-sitemap")}
                    disabled={loading === "revalidate-sitemap"}
                    className="w-full"
                  >
                    {loading === "revalidate-sitemap" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revalidating Sitemap...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Revalidate Sitemap
                      </>
                    )}
                  </Button>
                  {indexingResults["revalidate-sitemap"] && (
                    <Alert
                      className={`mt-4 ${indexingResults["revalidate-sitemap"].success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {indexingResults["revalidate-sitemap"].success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          <div className="space-y-2">
                            <div>
                              {indexingResults["revalidate-sitemap"].message}
                            </div>
                          </div>
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Single URL Indexing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Manual Google Indexing - Single URL
                  </CardTitle>
                  <CardDescription>
                    Submit a single URL directly to Google for fast indexing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="indexingUrl">URL to Index</Label>
                    <Input
                      id="indexingUrl"
                      value={indexingUrl}
                      onChange={(e) => setIndexingUrl(e.target.value)}
                      placeholder="https://legalcyfle.com/article-slug"
                    />
                  </div>
                  <Button
                    onClick={() => handleIndexing("single-url")}
                    disabled={!indexingUrl || loading === "single-url"}
                    className="w-full"
                  >
                    {loading === "single-url" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting to Google...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Submit to Google Indexing API
                      </>
                    )}
                  </Button>
                  {indexingResults["single-url"] && (
                    <Alert
                      className={`mt-4 ${indexingResults["single-url"].success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {indexingResults["single-url"].success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          <div className="space-y-2">
                            <div>{indexingResults["single-url"].message}</div>
                            {indexingResults["single-url"].results && (
                              <div className="space-y-1 text-xs">
                                <div>
                                  Google Indexing API:{" "}
                                  {indexingResults["single-url"].results.google
                                    ?.success
                                    ? "✅ Success"
                                    : "❌ Failed"}
                                </div>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Bulk URL Indexing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Manual Google Indexing - Bulk URLs
                  </CardTitle>
                  <CardDescription>
                    Submit multiple URLs for indexing (one URL per line)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="indexingUrls">URLs to Index</Label>
                    <Textarea
                      id="indexingUrls"
                      value={indexingUrls}
                      onChange={(e) => setIndexingUrls(e.target.value)}
                      placeholder={`https://legalcyfle.com/article-1
https://legalcyfle.com/article-2
https://legalcyfle.com/article-3`}
                      rows={5}
                    />
                  </div>
                  <Button
                    onClick={() => handleIndexing("bulk-urls")}
                    disabled={!indexingUrls.trim() || loading === "bulk-urls"}
                    className="w-full"
                  >
                    {loading === "bulk-urls" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Bulk Indexing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Submit Bulk URLs to Google
                      </>
                    )}
                  </Button>
                  {indexingResults["bulk-urls"] && (
                    <Alert
                      className={`mt-4 ${indexingResults["bulk-urls"].success ? "border-green-200" : "border-red-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        {indexingResults["bulk-urls"].success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          <div className="space-y-2">
                            <div>{indexingResults["bulk-urls"].message}</div>
                            {indexingResults["bulk-urls"].results?.results && (
                              <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                                {indexingResults[
                                  "bulk-urls"
                                ].results.results.map(
                                  (result: any, index: number) => (
                                    <div
                                      key={index}
                                      className="border-l-2 border-gray-200 pl-2"
                                    >
                                      <div className="truncate font-mono text-xs">
                                        {result.url}
                                      </div>
                                      <div>
                                        Google:{" "}
                                        {result.google?.success ? "✅" : "❌"}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
