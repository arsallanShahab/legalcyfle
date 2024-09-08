import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Messages {
  loading?: string;
  success?: string;
  failure?: string;
}

interface Cache {
  [key: string]: Map<string, any>;
}

const cache: Cache = {};

interface UseGetOptions {
  showToast?: boolean;
  messages?: Messages;
}

interface GetDataParams {
  url: string;
  tag?: string;
  options?: UseGetOptions;
}

const useGet = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async ({
    url,
    tag = "default",
    options = {},
  }: GetDataParams) => {
    const { showToast = true, messages = {} } = options;
    setLoading(true);
    let loading_toast: any;
    let tagCache = cache[tag];

    if (tagCache && tagCache.has(url)) {
      setData(tagCache.get(url));
      setLoading(false);
    } else {
      if (showToast) {
        loading_toast = toast.loading(messages.loading || "Loading...");
      }
      try {
        const response: AxiosResponse<T> = await axios.get(url);
        setData(response.data);
        if (!tagCache) {
          tagCache = new Map<string, T>();
          cache[tag] = tagCache;
        }
        tagCache.set(url, response.data);
        if (showToast) {
          toast.success(messages.success || "Data loaded successfully");
        }
      } catch (error: any) {
        setError(new Error(error?.response?.data?.message));
        if (showToast) {
          toast.error(
            messages.failure ||
              error?.response?.data?.message ||
              "An error occurred",
          );
        }
      } finally {
        setLoading(false);
        if (showToast && loading_toast) {
          toast.dismiss(loading_toast);
        }
      }
    }
  };

  const refreshData = async ({
    url,
    tag = "default",
    options = {},
  }: GetDataParams) => {
    const { showToast = true, messages = {} } = options;
    setLoading(true);
    let loading_toast: any;

    try {
      if (showToast) {
        loading_toast = toast.loading(messages.loading || "Refreshing data...");
      }

      const response: AxiosResponse<T> = await axios.get(url);
      setData(response.data);

      let tagCache = cache[tag];
      if (!tagCache) {
        tagCache = new Map<string, T>();
        cache[tag] = tagCache;
      }
      tagCache.set(url, response.data);

      if (showToast) {
        toast.success(messages.success || "Data refreshed successfully");
      }
    } catch (error: any) {
      setError(new Error(error?.message || "An error occurred during refresh"));
      if (showToast) {
        toast.error(
          messages.failure ||
            error?.message ||
            "An error occurred during refresh",
        );
      }
    } finally {
      setLoading(false);
      if (showToast && loading_toast) {
        toast.dismiss(loading_toast);
      }
    }
  };

  return { data, error, loading, getData, refreshData };
};

export default useGet;
