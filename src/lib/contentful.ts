// @/lib/contentful.js

import { createClient } from "contentful";

// Set up Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

export default client;
