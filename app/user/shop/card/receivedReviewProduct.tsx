import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import ReactStars from "react-stars";
import Swal from "sweetalert2";
import { Textarea } from "@nextui-org/input";

interface ReviewProps {
  productId: number;
  userId: number;
}

const ReceivedReviewProduct = ({ productId, userId }: ReviewProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rating, setRating] = useState(0);
  const [text, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // Tracks if the user has already reviewed

  // Fetch whether the user has already reviewed the product
  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/reviews/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              product_id: productId,
            }),
          },
        );

        const data = await response.json();
        setHasReviewed(data.hasReviewed); // Update state if the user has already reviewed the product
      } catch (error) {
        console.error("Error fetching review status:", error);
      }
    };

    fetchReviewStatus();
  }, [userId, productId]);

  // Handle rating change
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // Handle submit review
  const handleSubmitReview = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          rating: rating,
          text: text,
        }),
      });

      if (!response.ok) {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          text: "You have already rated this product.",
          showConfirmButton: false,
          timer: 1500,
          background: "#dc3545",
          color: "#ffffff",
        });
      } else {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          text: "Thank you for your review!",
          showConfirmButton: false,
          timer: 1500,
          background: "#28a745",
          color: "#ffffff",
        });
        setReviewText("");
        setRating(0);
        setHasReviewed(true); // Set to true after successful submission
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
      onOpenChange();
    }
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        onPress={onOpen}
        fullWidth={true}
        isDisabled={hasReviewed ? true : false}
      >
        {hasReviewed ? "Rated & Reviewed" : "Rate & Review"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Rate and Review the Product
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmitReview}>
                  <div className="flex flex-col items-center">
                    <ReactStars
                      count={5}
                      onChange={handleRatingChange}
                      size={40}
                      color2="#ffd700"
                      value={rating}
                      half={false} // Disable half-star rating
                    />
                    <Textarea
                      variant="bordered"
                      label="Review"
                      name="text"
                      id="text"
                      required
                      value={text}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={isSubmitting}
                    >
                      {!isSubmitting && "Submit"}
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReceivedReviewProduct;
