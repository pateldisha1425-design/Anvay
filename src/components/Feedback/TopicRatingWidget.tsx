import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { TopicReviewMeta } from '../../types/feedback';

interface TopicRatingWidgetProps {
  topicId: string;
  topicTitle: string;
  userRating?: number;
  reviewMeta?: TopicReviewMeta;
  onRate: (rating: number) => void;
  onOpenFeedback?: () => void;
  compact?: boolean;
}

export const TopicRatingWidget: React.FC<TopicRatingWidgetProps> = ({
  topicId,
  topicTitle,
  userRating,
  reviewMeta,
  onRate,
  onOpenFeedback,
  compact = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submittedFeedbackToast, setSubmittedFeedbackToast] = useState(false);

  const average = reviewMeta?.averageRating || 4.5;
  const count = reviewMeta?.totalRatings || 0;

  const handleStarClick = (rating: number) => {
    onRate(rating);
    setSubmittedFeedbackToast(true);
    setTimeout(() => setSubmittedFeedbackToast(false), 2500);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-zinc-300">
        <div className="flex items-center text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-zinc-200 ml-1 text-[11px]">{average.toFixed(1)}</span>
        </div>
        <span className="text-[10px] text-zinc-500">({count})</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#18181b] border border-[#26262a]">
      {/* Left: Star rating & Average score */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-300">Rate this topic:</span>
            {userRating && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                You rated {userRating} ★
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating !== null ? star <= hoverRating : userRating ? star <= userRating : star <= Math.round(average);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => handleStarClick(star)}
                  className="p-0.5 text-zinc-600 hover:text-amber-400 transition-colors focus:outline-none"
                  title={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={`w-4 h-4 transition-transform hover:scale-110 ${
                      active ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-semibold text-zinc-200 ml-1.5">
              {average.toFixed(1)}
            </span>
            <span className="text-[11px] text-zinc-500">
              ({count} {count === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>

        {submittedFeedbackToast && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thank you for rating!</span>
          </div>
        )}
      </div>

      {/* Right: Feedback / Report Button */}
      {onOpenFeedback && (
        <button
          onClick={onOpenFeedback}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#222228] hover:bg-[#2a2a32] text-zinc-300 hover:text-white border border-[#2f2f37] transition-colors"
          title="Report errors, unclear explanations, missing prerequisites or poor resources"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-zinc-300" />
          <span>Report Issue / Feedback</span>
        </button>
      )}
    </div>
  );
};
