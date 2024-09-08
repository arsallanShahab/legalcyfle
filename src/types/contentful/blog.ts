import { BLOCKS } from "@contentful/rich-text-types";

type SysLink = {
  sys: {
    type: "Link";
    linkType: string;
    id: string;
  };
};

type Metadata = {
  tags: string[];
};

type Sys = {
  space: SysLink;
  id: string;
  type: "Entry" | "Asset";
  createdAt: string;
  updatedAt: string;
  environment: SysLink & {
    sys: {
      linkType: "Environment";
    };
  };
  revision: number;
  contentType?: SysLink & {
    sys: {
      linkType: "ContentType";
    };
  };
  locale: string;
};

type ImageFileDetails = {
  size: number;
  image: {
    width: number;
    height: number;
  };
};

type ImageFields = {
  title: string;
  description: string;
  file: {
    url: string;
    details: ImageFileDetails;
    fileName: string;
    contentType: string;
  };
};

type Image = {
  metadata: Metadata;
  sys: Sys;
  fields: ImageFields;
};

export type ParagraphContent = {
  data: {};
  content: Array<{
    data: {};
    marks: Array<{
      type: string;
    }>;
    value: string;
    nodeType: string;
  }>;
  nodeType: string;
};

type Node = {
  nodeType: string;
  data: {
    uri: string;
    target: {
      fields: {
        title: string;
        slug: string;
        file: {
          contentType: string;
          url: string;
        };
      };
    };
  };
  content: {
    data: {
      uri: string;
      target: {
        fields: {
          title: string;
          file: {
            url: string;
          };
        };
      };
    };
    content: { value: string }[];
    value: string;
    marks: { type: string }[];
    nodeType: string;
  }[];
};

type Body = {
  data: {};
  nodeType: BLOCKS.DOCUMENT;
  content: Node[];
};

type AuthorFields = {
  name: string;
  bio: string;
  avatar: Image;
  address: {
    lon: number;
    lat: number;
  };
};

type Author = {
  metadata: Metadata;
  sys: Sys;
  fields: AuthorFields;
};

type CategoryFields = {
  slug: string;
  name: string;
  image: Image;
};

type Category = {
  metadata: Metadata;
  sys: Sys;
  fields: CategoryFields;
};

type BlogEntryFields = {
  slug: string;
  title: string;
  date: string;
  image: Image;
  description: string;
  body: Body;
  author: Author;
  authors: Author[];
  category: Category[];
};

export type BlogEntry = {
  metadata: Metadata;
  sys: Sys;
  fields: BlogEntryFields;
};

export type BlogEntries = BlogEntry[];
