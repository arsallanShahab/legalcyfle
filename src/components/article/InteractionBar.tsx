import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import { IArticle } from "@/types/global/article";
import { Ban, Eye, Heart, Loader, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

interface InteractionBarProps {
  article: IArticle | null;
  isLoadingMetrics: boolean;
  likeLoading: boolean;
  dislikeLoading: boolean;
  heartLoading: boolean;
  isLiked: boolean | undefined;
  isDisliked: boolean | undefined;
  isHearted: boolean | undefined;
  likeCount: number | undefined;
  dislikeCount: number | undefined;
  heartCount: number | undefined;
  error: any;
  onLike: () => void;
  onDislike: () => void;
  onHeart: () => void;
}

const InteractionBar: React.FC<InteractionBarProps> = ({
  article,
  isLoadingMetrics,
  likeLoading,
  dislikeLoading,
  heartLoading,
  isLiked,
  isDisliked,
  isHearted,
  likeCount,
  dislikeCount,
  heartCount,
  error,
  onLike,
  onDislike,
  onHeart,
}) => {
  return (
    <section className="article-engagement mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
      <FlexContainer variant="column-start" gap="md">
        {/* Article Stats */}
        <FlexContainer
          variant="row-start"
          gap="sm"
          alignItems="center"
          className="mb-4"
        >
          {isLoadingMetrics ? (
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
              <Loader className="h-3 w-3 animate-spin" />
              <span className="font-sans text-xs font-medium">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
              <Eye className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {article?.views?.toLocaleString()} views
              </span>
            </div>
          )}
        </FlexContainer>

        {/* Engagement Buttons */}
        <FlexContainer variant="row-start" gap="sm" wrap="wrap">
          {/* Heart button */}
          {isLoadingMetrics ? (
            <Button
              disabled
              size="sm"
              className="rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-400"
            >
              <Loader className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={onHeart}
              disabled={
                isLoadingMetrics || heartLoading || isLiked || isDisliked
              }
              loading={heartLoading}
              size="sm"
              variant="outline"
              className="gap-2 rounded-full border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30"
            >
              {error ? (
                <Ban className="h-4 w-4" />
              ) : (
                <>
                  <Heart
                    className={`h-4 w-4 ${isHearted ? "fill-current" : ""}`}
                  />
                  <span className="font-sans text-sm font-bold">
                    {heartCount}
                  </span>
                </>
              )}
            </Button>
          )}

          {/* Like button */}
          {isLoadingMetrics ? (
            <Button
              disabled
              size="sm"
              className="rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <Loader className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={onLike}
              disabled={
                isLoadingMetrics || likeLoading || isHearted || isDisliked
              }
              loading={likeLoading}
              size="sm"
              variant="outline"
              className="gap-2 rounded-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              {error ? (
                <Ban className="h-4 w-4" />
              ) : (
                <>
                  <ThumbsUp
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="font-sans text-sm font-bold">
                    {likeCount}
                  </span>
                </>
              )}
            </Button>
          )}

          {/* Dislike button */}
          {isLoadingMetrics ? (
            <Button
              disabled
              size="sm"
              className="rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
            >
              <Loader className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={onDislike}
              disabled={
                isLoadingMetrics || dislikeLoading || isHearted || isLiked
              }
              loading={dislikeLoading}
              size="sm"
              variant="outline"
              className="gap-2 rounded-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <ThumbsDown
                className={`h-4 w-4 ${isDisliked ? "fill-current" : ""}`}
              />
              <span className="font-sans text-sm font-bold">
                {dislikeCount}
              </span>
            </Button>
          )}
        </FlexContainer>
      </FlexContainer>
    </section>
  );
};

export default InteractionBar;
