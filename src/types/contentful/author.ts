type Metadata = {
  tags: any[];
};

type SysLink = {
  type: string;
  linkType: string;
  id: string;
};

type Sys = {
  space: {
    sys: SysLink;
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: SysLink;
  };
  revision: number;
  contentType: {
    sys: SysLink;
  };
  locale: string;
};

type ImageDetails = {
  width: number;
  height: number;
};

type FileDetails = {
  size: number;
  image: ImageDetails;
};

type File = {
  url: string;
  details: FileDetails;
  fileName: string;
  contentType: string;
};

type AvatarFields = {
  title: string;
  description: string;
  file: File;
};

type Avatar = {
  metadata: Metadata;
  sys: Sys;
  fields: AvatarFields;
};

type Address = {
  lon: number;
  lat: number;
};

type Fields = {
  name: string;
  avatar: Avatar;
  address: Address;
  bio: string;
  // type: "guest-author" | "co-ordinators" | "legalcyfle-team";
  type: string;
};

export type Author = {
  metadata: Metadata;
  sys: Sys;
  fields: Fields;
};

export type Authors = Author[];
