"use client";
import { UploadDocumentModal } from "@/components/app/new-apps/components/UploadDocumentModal";
import { VerticalDescriptionPanel } from "@/components/reusable";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DisplayQuestion } from "@/lib";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import { fieldsScreening, labelsScreening, schemaScreening } from ".";
import { ProposalDocuments, RadioSimpleInput } from "../../components";

interface ScreeningProps {
  goToNextTab: () => void;
}

type AddInputFormValues = z.infer<typeof schemaScreening>;

export const Screening: FC<ScreeningProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();
  const doctypes = [
    "FINANCIAL_QUESTIONNAIRE",
    "SOURCE_OF_FUNDS_DOCUMENT",
    "BRIDGER_REPORT_PAYER",
    "BRIDGER_REPORT_OWNER",
    "OTHERS",
    "MANUAL_APPLICATION_FORM",
  ];

  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaScreening),
    mode: "onChange",
  });

  const [showFields, setShowFields] = useState(fieldsScreening);

  const {
    loading,
    documents,
    personalDetail,
    toggleProposalModal,
    submitFeedback,
  } = useProposalStore();

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
  };

  const getInitValue = (fieldName: string) => {
    return showFields[fieldName as keyof typeof showFields] || "No";
  };

  const onSubmit = async (data: AddInputFormValues) => {
    const relistData: { key: string; label: string; value: string }[] = [];
    const amlData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      if (showFields[field as keyof typeof showFields] === "Yes") {
        const dataValue = data[field as keyof AddInputFormValues] as string;
        const labelInfo =
          labelsScreening[field as keyof typeof labelsScreening];
        if (labelInfo.type === "Relisted Reason") {
          relistData.push({
            key: field,
            label: labelInfo.label,
            value: dataValue,
          });
        } else if (labelInfo.type === "Aml") {
          amlData.push({
            key: field,
            label: labelInfo.label,
            value: "Yes",
          });
        }
      }
    }

    if (relistData.length === 0 && amlData.length === 0) {
      goToNextTab();
    } else {
      const payload = [];
      if (relistData.length > 0) {
        payload.push({
          changeType: "ReviewRelist",
          proposalReview: relistData,
        });
      }
      if (amlData.length > 0) {
        payload.push({ changeType: "Aml", proposalReview: amlData });
      }

      try {
        await submitFeedback(params?.id, "Screening", payload);
        console.log(JSON.stringify(payload));
        await toast.success("Screening details review success", {
          description: "Reviews posted successfully!",
        });
        goToNextTab();
      } catch (error: any) {
        await toast.error("Screening details failure!", {
          description: error?.response?.data?.description,
        });
      }
    }
  };

  const uploadDocumentModal = () => {
    toggleProposalModal({ uploadDocuments: true });
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
      <section className="bg-white px-5 rounded-xl py-4 px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-3">
          <div className={`col-span-3 grid md:grid-cols-2 gap-10`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <h3 className="text-center font-semibold m-5">PEP Questions</h3>

                <VerticalDescriptionPanel
                  label={"1. " + DisplayQuestion("politicalOrRankingOffice")}
                  description={
                    personalDetail?.politicalOrRankingOffice ? "Yes" : "No"
                  }
                />

                <VerticalDescriptionPanel
                  label={
                    "2. " + DisplayQuestion("relativePoliticalOrRankingOffice")
                  }
                  description={
                    personalDetail?.relativePoliticalOrRankingOffice
                      ? "Yes"
                      : "No"
                  }
                />
                <div className="mb-5"></div>

                {Object.values(labelsScreening).map((field) => (
                  <RadioSimpleInput
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    control={form.control}
                    initValue={getInitValue(field.name)}
                    onValueChange={(value) =>
                      handleRadioChange(field.name, value)
                    }
                    selectOptions={field.options}
                    useSelectInput={!["Aml"].includes(field.type)}
                  />
                ))}

                <div className="flex items-end justify-end m-4">
                  <Button
                    type="submit"
                    variant={"outline"}
                    className="border-primary text-primary rounded-lg px-14"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </Form>

            <div className="px-2 py-6">
              <div className="px-2 py-6">
                {_.isEmpty(documents) && !loading ? (
                  <SuccessOrErrorState
                    state="empty"
                    message="No documents found"
                  />
                ) : (
                  <ProposalDocuments doctypes={doctypes} docUserType="OWNER" />
                )}
              </div>
              <div className="flex items-center justify-center m-4">
                <UploadDocumentModal />
                <div className="space-x-4">
                  <Button
                    variant={"outline"}
                    className="text-white border-primary text-primary border-2"
                    onClick={() => uploadDocumentModal()}
                  >
                    Upload Bridger Documents
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
