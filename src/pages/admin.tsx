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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  FolderOpen,
  Globe,
  Home,
  Loader2,
  RefreshCw,
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
  const [categoryPaths, setCategoryPaths] = useState<string[]>([
    "/category/blogs-news",
    "/category/opportunities",
    "/category/resources",
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const router = useRouter();

  // Fetch categories from Contentful
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/admin/categories");
        const data = await response.json();

        if (data.success && data.categories.length > 0) {
          setCategoryPaths(data.categories);
          console.log("Fetched categories from Contentful:", data.categories);
        } else {
          console.warn("No categories found or API error:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch categories from Contentful:", error);
        // Keep the default hardcoded paths if fetching fails
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Security: Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(
        () => {
          setIsAuthenticated(false);
          alert("Session expired for security. Please login again.");
        },
        30 * 60 * 1000,
      ); // 30 minutes

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated]);

  const handleAuth = async () => {
    setLoading("auth");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword("");
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

  const refreshCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("/api/admin/categories");
      const data = await response.json();

      if (data.success && data.categories.length > 0) {
        setCategoryPaths(data.categories);
        console.log("Refreshed categories from Contentful:", data.categories);
      } else {
        console.warn("No categories found or API error:", data.message);
        alert("Failed to refresh categories from Contentful");
      }
    } catch (error) {
      console.error("Failed to refresh categories from Contentful:", error);
      alert("Failed to refresh categories from Contentful");
    } finally {
      setCategoriesLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-600" />
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter password to access admin panel
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
                onKeyPress={(e) => e.key === "Enter" && handleAuth()}
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
                "Access Admin Panel"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage site revalidation and cache clearing
          </p>
        </div>

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

          {/* Category Pages Revalidation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Category Pages
              </CardTitle>
              <CardDescription>
                Revalidate all category pages (dynamically fetched from
                Contentful)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {categoriesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading categories from Contentful...
                    </div>
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
                onClick={() => handleRevalidation("categories", categoryPaths)}
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

        {/* Full Site Revalidation */}
        {/* <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <RefreshCw className="h-5 w-5" />
              Full Site Revalidation
            </CardTitle>
            <CardDescription>
              Revalidate the entire site (use with caution - may take longer)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleRevalidation("fullsite")}
              disabled={loading === "fullsite"}
              variant="destructive"
              className="w-full"
            >
              {loading === "fullsite" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revalidating Full Site...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Revalidate Full Site
                </>
              )}
            </Button>
            {results.fullsite && (
              <Alert
                className={`mt-4 ${results.fullsite.success ? "border-green-200" : "border-red-200"}`}
              >
                <div className="flex items-center gap-2">
                  {results.fullsite.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {results.fullsite.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card> */}

        <div className="mt-8 text-center">
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
