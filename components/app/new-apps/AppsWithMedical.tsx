"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { useProposalStore } from "@/state/proposal/proposal";
import _ from "lodash";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { NewAppsTable } from ".";

export function AppsWithMedical() {
  const { proposals, pagination, loading, fetchProposals } = useProposalStore();

  useEffect(() => {
    const fetchProposalsAsync = async () =>
      await fetchProposals("Review", {}, undefined, "MedicalProduct");
    try {
      fetchProposalsAsync();
    } catch (error: any) {
      toast.error("Something went wrong!", {
        description: error?.response?.data?.description,
      });
    }
  }, []);

  const handlePagination = (page: number) => {
    fetchProposals(
      "Review",
      {
        page: page,
        size: pagination.size,
      },
      undefined,
      "MedicalProduct"
    );
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
    <div>
      {_.isEmpty(proposals) && !loading ? (
        <SuccessOrErrorState state="empty" message="No Proposal Found" />
      ) : (
        <NewAppsTable
          data={proposals}
          pagination={pagination}
          withPagination={true}
          onPaginationChange={handlePagination}
        />
      )}
    </div>
  );
}
