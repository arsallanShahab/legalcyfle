// Alternative approach using Search Console API
export async function submitToSearchConsole(url: string) {
  try {
    // Using fetch to submit to Search Console API
    const response = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Search Console submission:", result);
    return result;
  } catch (error) {
    console.error("Error submitting to Search Console:", error);
    return null;
  }
}

// Submit URL for inspection and indexing
export async function requestIndexingViaSearchConsole(url: string) {
  try {
    const response = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
        }),
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error requesting indexing via Search Console:", error);
    return null;
  }
}
