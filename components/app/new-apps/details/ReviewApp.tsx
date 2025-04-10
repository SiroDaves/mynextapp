"use client";
import { VerticalDescriptionPanel } from "@/components/reusable";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { FormatDob } from "@/lib/formating";
import { useProposalStore } from "@/state/proposal/proposal";
import _ from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";

export const ReviewApp = () => {
  const params = useParams<{ id: string }>();

  const router = useRouter();

  const { loading, relistReasons, fetchRelistReasons, submitFeedback } =
    useProposalStore();

  useEffect(() => {
    const fetchRelistReasonsAsync = async () => {
      try {
        await fetchRelistReasons(params?.id);
      } catch (error: any) {
        console.log(
          `{'Fetching relisted reasons failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No relisted reasons found for this proposal.");
      }
    };
    fetchRelistReasonsAsync();
  }, [params?.id]);

  const completeReview = async () => {
    try {
      await submitFeedback(params?.id, "Preview");
      router.push("/new-apps");
      await toast.success("Review success report", {
        description: "Review completed successfully!",
      });
    } catch (error: any) {
      await toast.error("Something went wrong!", {
        description: error?.response?.data?.description,
      });
    }
  };

  if (loading) {
    return (
      <Skeleton
        count={20}
        height={20}
        baseColor="#EEEEEE"
        highlightColor="#0077BE"
      />
    );
  }

  return (
    <div className="bg-white px-10 py-8 rounded-2xl">
      <section className="">
        <h3 className="text-center font-semibold m-5">Reviews</h3>
        {_.isEmpty(relistReasons) && !loading ? (
          <SuccessOrErrorState state="empty" message="No reviews found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-6">
            {relistReasons.map((reason: any) => (
              <VerticalDescriptionPanel
                label={reason?.label}
                description={reason?.key == 'dateOfBirth' ? FormatDob(reason?.value) : reason?.value}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-center m-4">
          <Button
            onClick={completeReview}
            variant={"outline"}
            className="border-primary text-primary rounded-lg px-14"
          >
            Complete
          </Button>
        </div>
      </section>
    </div>
  );
};
