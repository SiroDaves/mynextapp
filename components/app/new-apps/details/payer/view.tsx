"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import { descriptionPayer, fieldsPayer, labelsPayer, schemaPayer } from ".";
import { ProposalDocuments, RadioTextInput } from "../../components";

interface PayerDetailsProps {
  goToNextTab: () => void;
}

type AddInputFormValues = z.infer<typeof schemaPayer>;

export const PayerDetails: FC<PayerDetailsProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();
  const doctypes = ["IDENTIFICATION_DOCUMENT"];

  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaPayer),
    mode: "onChange",
  });

  const [occupations, setOccupations] = useState<any | null>(null);
  const [maritals, setMaritals] = useState<any | null>(null);
  const [relationships, setRelationship] = useState<any | null>(null);

  const [showFields, setShowFields] = useState(fieldsPayer);
  const {
    selectedProposal,
    payerDetails,
    documents,
    loading,
    fetchPayerDetails,
    fetchLookUpList,
    submitFeedback,
  } = useProposalStore();

  useEffect(() => {
    const fetchPayerDetailsAsync = async () => {
      if (selectedProposal?.hasPayer) {
        try {
          await fetchPayerDetails(params?.id);
        } catch (error: any) {
          console.log(
            `{'Fetching payer details failed: ${error?.response?.data?.description}'}`
          );
          await toast.error("No payer details found for this proposal.");
        }
      }
    };

    const fetchOccupationsAsync = async () => {
      try {
        const response = await fetchLookUpList("OCCUPATIONS");
        setOccupations(response.data);
      } catch (error: any) {
        console.log(
          `{'Fetching lookuplist for occupations failed: ${error?.response?.data?.description}'}`
        );
      }
    };

    const fetchMaritalsAsync = async () => {
      try {
        const response = await fetchLookUpList("MARITAL_STATUS");
        setMaritals(response.data);
      } catch (error: any) {
        console.log(
          `{'Fetching lookuplist for maritals failed: ${error?.response?.data?.description}'}`
        );
      }
    };

    const fetchRelationshipsAsync = async () => {
      try {
        const response = await fetchLookUpList("RELATIONSHIPS");
        setRelationship(response.data);
      } catch (error: any) {
        console.log(
          `{'Fetching lookuplist for maritals failed: ${error?.response?.data?.description}'}`
        );
      }
    };
    fetchPayerDetailsAsync();
    fetchOccupationsAsync();
    fetchMaritalsAsync();
    fetchRelationshipsAsync();
  }, [params?.id]);

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
  };

  const getInitValue = (fieldName: string) => {
    return showFields[fieldName as keyof typeof showFields];
  };

  const onSubmit = async (data: AddInputFormValues) => {
    const editData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const dataValue = data[field as keyof AddInputFormValues] as string;
      if (showFields[field as keyof typeof showFields] === "No" && dataValue) {
        const labelInfo = labelsPayer[field as keyof typeof labelsPayer];
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
      goToNextTab();
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

      try {
        await submitFeedback(params?.id, "PayerDetails", payload);
        await toast.success("Payer details review success", {
          description: "Reviews posted successfully!",
        });
        goToNextTab();
        console.log(JSON.stringify(payload));
      } catch (error: any) {
        await toast.error("Payer details failure!", {
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
    <div>
      <section className="bg-white px-5 rounded-xl py-4 px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-3">
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

                {Object.values(labelsPayer).map((field) => (
                  <RadioTextInput
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    control={form.control}
                    initValue={getInitValue(field.name)}
                    onValueChange={(value) =>
                      handleRadioChange(field.name, value)
                    }
                    description={descriptionPayer(
                      field.name,
                      payerDetails,
                      occupations,
                      maritals,
                      relationships
                    )}
                    selectOptions={field.options}
                    readOnly={field.type === ""}
                    useTextInput={["Edit"].includes(field.type)}
                    useDateInput={["dateOfBirth"].includes(field.name)}
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
                  <ProposalDocuments doctypes={doctypes} docUserType="PAYER" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
