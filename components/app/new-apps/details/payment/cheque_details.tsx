"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormatButtonTitle } from "@/lib";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import {
  descriptionCheque,
  getFieldsCheque,
  getLabelsCheque,
  getSchemaCheque,
} from ".";
import {
  ProposalDocuments,
  RadioTextInput,
  SubsequentDocuments,
} from "../../components";

interface ChequeDetailsProps {
  subsequent?: boolean;
  firstSubsequentDifferent?: boolean;
  onNextAction: () => void;
}

export const ChequeDetails: FC<ChequeDetailsProps> = ({
  subsequent = false,
  firstSubsequentDifferent = true,
  onNextAction,
}) => {
  const params = useParams<{ id: string }>();
  const schemaCheque = useMemo(() => getSchemaCheque(subsequent), [subsequent]);
  const fieldsCheque = getFieldsCheque(subsequent);
  const labelsCheque = getLabelsCheque(subsequent);

  type AddInputFormValues = z.infer<typeof schemaCheque>;
  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaCheque),
    mode: "onChange",
  });

  const [showFields, setShowFields] = useState(fieldsCheque);

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
  };

  const {
    selectedProposal,
    personalDetail,
    documents,
    loading,
    submitFeedback,
  } = useProposalStore();

  const onSubmit = async (data: AddInputFormValues) => {
    const editData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const labelInfo = labelsCheque[field as keyof typeof labelsCheque];
      const dataValue = data[field as keyof AddInputFormValues] as string;
      if (dataValue) {
        const fieldData = {
          key: field,
          label: labelInfo.label,
          value: dataValue,
        };

        if (labelInfo.type === "Edit") {
          editData.push(fieldData);
        } else if (labelInfo.type === "Relisted Reason") {
          relistData.push(fieldData);
        }
      }
    }

    if (editData.length === 0 && relistData.length === 0) {
      onNextAction();
    } else {
      const payload = [];
      if (editData.length > 0) {
        payload.push({ changeType: "Edit", proposalReview: editData });
      }
      if (relistData.length > 0) {
        payload.push({
          changeType: "ReviewRelist",
          proposalReview: relistData,
        });
      }
      console.log(JSON.stringify(payload));

      try {
        await submitFeedback(params?.id, "PaymentDetails", payload);
        await toast.success("Payment details review success", {
          description: "Review posted successfully!",
        });
        onNextAction();
      } catch (error: any) {
        await toast.error("Payment details failure!", {
          description: error?.response?.data?.description,
        });
      }
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
    <div className="col-span-3 grid md:grid-cols-2 gap-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="w-full" />
            <div className="flex">
              <div className="flex items-center justify-center">
                <div className="items-stretch space-x-2">
                  <span>Yes</span>
                  <span>No</span>
                </div>
              </div>
            </div>
            <div className="w-full" />
          </div>

          {Object.values(labelsCheque).map((field) => (
            <RadioTextInput
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              control={form.control}
              initValue={"Yes"}
              onValueChange={(value) => handleRadioChange(field.name, value)}
              description={descriptionCheque(
                field.name,
                selectedProposal,
                personalDetail
              )}
              selectOptions={field.options}
              readOnly={field.type === ""}
              useTextInput={["Edit"].includes(field.type)}
            />
          ))}

          <div className="flex items-center justify-center m-4">
            <Button
              type="submit"
              variant={"outline"}
              className="border-primary text-primary rounded-lg px-14"
            >
              {FormatButtonTitle(subsequent, firstSubsequentDifferent)}
            </Button>
          </div>
        </form>
      </Form>

      <div className="px-2 py-6">
        {_.isEmpty(documents) && !loading ? (
          <SuccessOrErrorState state="empty" message="No documents found" />
        ) : subsequent ? (
          <SubsequentDocuments doctypes={["CHEQUE"]} docUserType="OWNER" />
        ) : (
          <ProposalDocuments doctypes={["CHEQUE", "MANUAL_APPLICATION_FORM"]} docUserType="OWNER" />
        )}
      </div>
    </div>
  );
};
