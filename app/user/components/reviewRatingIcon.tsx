import React from "react";
import { StarFilledIcon, StarEmptyIcon } from "@/components/user/icons";

interface ReviewRatingIconProps {
  RatingValue: number;
}

const ReviewRatingIcon: React.FC<ReviewRatingIconProps> = ({ RatingValue }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) =>
        index < RatingValue ? (
          <StarFilledIcon key={index} />
        ) : (
          <StarEmptyIcon key={index} />
        ),
      )}
    </div>
  );
};

export default ReviewRatingIcon;
