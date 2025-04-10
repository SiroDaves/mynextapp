"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/state/auth/auth";
import { useProposalStore } from "@/state/proposal/proposal";
import { MoveFilesRequest } from "@/state/proposal/types";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { DocumentCard } from "../../proposal/documents/DocumentCard";
import { UploadDocumentModal } from "../components/UploadDocumentModal";

interface DocumentDetailsProps {
  goToNextTab: () => void;
}

export const DocumentDetails: FC<DocumentDetailsProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    loading,
    documents,
    selectedProposal,
    fetchDocuments,
    createDocumentFolder,
    toggleProposalModal,
    agentDetails,
  } = useProposalStore();
  function findBranchNameByOrgType(orgType: string): string | undefined {
    const hierarchyItem = agentDetails?.FAHIERARCHY?.FAHIERARCHY_ITEM.find(
      (item: any) => item.ORG_TYPE === orgType
    );
    return hierarchyItem ? hierarchyItem.ORG_NAME : undefined;
  }

  let paymentType = "Mobile Money";
  if (
    selectedProposal?.paymentMethod == "CHECK_OFF" ||
    selectedProposal?.paymentMethod == "DIRECT_DEBIT" ||
    selectedProposal?.paymentMethod == "RTGS"
  ) {
    paymentType = "Checkoff or DDA - First Premium";
  } else if (selectedProposal?.paymentMethod == "CHEQUE") {
    paymentType = "Cheque";
  }

  let branchName = findBranchNameByOrgType("Branch");

  if (agentDetails?.CONTRACT_NUMBER == 1015981) {
    branchName = "Nairobi 5";
  }

  useEffect(() => {
    fetchDocuments(params?.id);
  }, [params?.id]);

  const folderMove = async () => {
    const data: MoveFilesRequest = {
      branch: branchName,
      paymentType: paymentType,
      planNo: selectedProposal?.quoteDetail?.planNo,
      policyNumber: selectedProposal?.policyNumber,
      sumAssured: selectedProposal?.quoteDetail?.sumAssured,
    };
    try {
      await createDocumentFolder(params.id, data);
    } catch (error: any) {
      toast.error("Something went wrong!", {
        description: error?.response?.data?.description,
      });
    }
  };

  const uploadDocumentModal = () => {
    toggleProposalModal({ uploadDocuments: true });
  };

  const isEmpty = documents?.some((doc: any) => doc.imageNowDocumentID === "");
  const isWorkflowId = selectedProposal?.workflowId != "";

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
    <div className=" bg-white rounded-xl px-10 py-4">
      <UploadDocumentModal />
      <div className="flex sm:flex-col md:flex-row justify-between items-center">
        <h3 className="font-semibold text-lg">Mandatory documents</h3>
        {user?.role !== "ISC_USER" && (
          <div className="space-x-4">
            {selectedProposal?.quoteStatus == "Approved" && (
              <Button
                type="submit"
                variant={"outline"}
                className="text-white border-primary text-primary border-2"
                onClick={() => uploadDocumentModal()}
                disabled={isWorkflowId}
              >
                Upload Document
              </Button>
            )}

            {isEmpty ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="bg-gray-400 text-white px-3 py-2 rounded-md">
                    Create Documents Folder
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Make sure you have upload all documents</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                type="submit"
                className="text-white"
                onClick={() => folderMove()}
                disabled={isWorkflowId}
              >
                Create Documents Folder
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl mt-5">
        <div className="pt-2">
          {_.isEmpty(documents) && !loading ? (
            <SuccessOrErrorState state="empty" message="No Documents Found" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents?.map((doc: any) => (
                <DocumentCard doc={doc} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center m-8">
        <Button
          onClick={goToNextTab}
          variant={"outline"}
          className="border-primary text-primary rounded-lg px-14"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
