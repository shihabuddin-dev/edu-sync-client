import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaStar, FaUser, FaRegStar, FaCheckCircle, FaComments } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Swal from 'sweetalert2';
import { MdVerified } from 'react-icons/md';
import { inputBase } from '../../utils/inputBase';

const Reviews = () => {
    const { user } = useAuth();
    const { id: sessionId } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch reviews for this specific session
    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['session-reviews', sessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/session/${sessionId}`);
            return res.data;
        },
        enabled: !!sessionId,
    });

    // Check if user has already reviewed this session
    const hasUserReviewed = reviews.some(review => review.studentEmail === user?.email);

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Submit review mutation
    const submitReviewMutation = useMutation({
        mutationFn: async (reviewData) => {
            const res = await axiosSecure.post('/reviews', reviewData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['session-reviews', sessionId]);
            Swal.fire({
                icon: 'success',
                title: 'Review Submitted!',
                text: 'Thank you for your review.',
                confirmButtonText: 'OK'
            });
            // Reset form
            setRating(0);
            setComment('');
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Review Submission Failed',
                text: error?.response?.data?.message || 'Something went wrong while submitting your review.',
            });
        }
    });

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please sign in to submit a review.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (rating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Rating Required',
                text: 'Please select a rating before submitting.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Comment Required',
                text: 'Please write a comment before submitting.',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsSubmitting(true);

        const reviewData = {
            sessionId: sessionId,
            studentName: user.displayName || 'Anonymous',
            studentEmail: user.email,
            studentPhoto: user.photoURL || null,
            isVerified: user.emailVerified || false,
            rating: rating,
            comment: comment.trim(),
            createdAt: new Date().toISOString()
        };

        submitReviewMutation.mutate(reviewData);
        setIsSubmitting(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-base-content mb-2">Reviews</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FaStar className="text-warning text-xl" />
                        <span className="text-2xl font-bold">{averageRating}</span>
                        <span className="text-base-content/70">({reviews.length} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {user && !hasUserReviewed && (
                <div className="bg-base-200 rounded-md p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="text-2xl transition-colors"
                                    >
                                        {star <= (hover || rating) ? (
                                            <FaStar className="text-warning" />
                                        ) : (
                                            <FaRegStar className="text-base-content/30" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-base-content/70 mt-1">
                                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Comment</label>
                            <div className="relative">
                                <FaComments className="absolute left-3 top-4 text-base-content/50 text-lg z-10" />
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className={`${inputBase} h-24 resize-none`}
                                    placeholder="Share your experience with this session..."
                                    maxLength={500}
                                />
                            </div>
                            <p className="text-sm text-base-content/70 mt-1">
                                {comment.length}/500 characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || !comment.trim()}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </form>
                </div>
            )}

            {user && hasUserReviewed && (
                <div className="bg-success/10 border border-success/20 rounded-md p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-success" />
                        <span className="text-success font-medium">You have already reviewed this session</span>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div>
                <h4 className="text-lg font-semibold mb-4">All Reviews</h4>

                {reviewsLoading ? (
                    <div className="text-center py-8">
                        <div className="loading loading-spinner loading-md"></div>
                        <p className="mt-2 text-base-content/70">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-base-content/70">No reviews yet. Be the first to review this session!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="border border-base-300 rounded-md p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {review.studentPhoto ? (
                                            <img
                                                src={review.studentPhoto}
                                                alt={review.studentName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <FaUser className="text-primary" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h5 className="font-semibold">{review.studentName}</h5>
                                            {review.isVerified && (
                                                <MdVerified className="text-success text-sm" title="Verified User" />
                                            )}
                                            <span className="text-sm text-base-content/70">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`text-sm ${star <= review.rating ? 'text-warning' : 'text-base-content/20'}`}
                                                />
                                            ))}
                                            <span className="text-sm text-base-content/70 ml-1">
                                                {review.rating} star{review.rating > 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        <p className="text-base-content/80 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;