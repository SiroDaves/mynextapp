"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
import { descriptionPolicy, fieldsPolicy, labelsPolicy, schemaPolicy } from ".";
import { ProposalDocuments, RadioTextInput } from "../../components";

interface PolicyOwnerProps {
  goToNextTab: () => void;
}

export const PolicyOwnerDetails: FC<PolicyOwnerProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();
  const doctypes = [
    "IDENTIFICATION_DOCUMENT",
    "US_INDICIA_FORM",
    "MANUAL_APPLICATION_FORM",
  ];
  type AddInputFormValues = z.infer<typeof schemaPolicy>;
  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaPolicy),
    mode: "onChange",
  });

  const [occupations, setOccupations] = useState<any | null>(null);
  const [showFields, setShowFields] = useState(fieldsPolicy);
  const [manualApplicationForm, setManualApplicationForm] = useState("");

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
    if (field === labelsPolicy.manualApplicationForm.name) {
      setManualApplicationForm(value);
    }
  };

  const {
    selectedProposal,
    personalDetail,
    personalInfo,
    hasManualApp,
    documents,
    loading,
    fetchAgentDetails,
    fetchPersonalDetails,
    fetchLookUpList,
    fetchPlanDetails,
    fetchRiders,
    fetchDocuments,
    fetchPersonalInfo,
    submitFeedback,
  } = useProposalStore();

  useEffect(() => {
    const fetchPersonalDetailsAsync = async () => {
      try {
        await fetchPersonalDetails(params?.id);
      } catch (error: any) {
        console.log(
          `{'Fetching personal details failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No personal details found for this proposal.");
      }
    };
    const fetchPersonalInfoAsync = async () => {
      try {
        await fetchPersonalInfo(params?.id);
      } catch (error: any) {
        console.log(
          `{'Fetching personal info failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No personal info found for this proposal.");
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
    const fetchAgentDetailsAsync = async () => {
      try {
        await fetchAgentDetails(selectedProposal?.contractNumber);
      } catch (error: any) {
        console.log(
          `{'Fetching agent details failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No agent details found for this proposal.");
      }
    };
    const fetchRidersAsync = async () => {
      try {
        await fetchRiders(selectedProposal?.quoteDetail?.planNo);
      } catch (error: any) {
        console.log(
          `{'Fetching riders failed: ${error?.response?.data?.description}'}`
        );
      }
    };
    const fetchPlanDetailsAsync = async () => {
      try {
        await fetchPlanDetails(params?.id);
      } catch (error: any) {
        console.log(
          `{'Fetching plan details failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No plan details found for this proposal.");
      }
    };
    const fetchDocumentsAsync = async () => {
      try {
        await fetchDocuments(params?.id);
      } catch (error: any) {
        console.log(
          `{'Fetching documents failed: ${error?.response?.data?.description}'}`
        );
        await toast.error("No documents found for this proposal.");
      }
    };

    fetchPersonalDetailsAsync();
    fetchPersonalInfoAsync();
    fetchAgentDetailsAsync();
    fetchOccupationsAsync();
    fetchRidersAsync();
    fetchPlanDetailsAsync();
    fetchDocumentsAsync();
  }, [params?.id]);

  const getInitValue = (fieldName: string) => {
    return showFields[fieldName as keyof typeof showFields] || "Yes";
  };

  const onSubmit = async (data: AddInputFormValues) => {
    const editData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const labelInfo = labelsPolicy[field as keyof typeof labelsPolicy];
      const dataValue = data[field as keyof AddInputFormValues] as string;
      if (showFields[field as keyof typeof showFields] === "No" && dataValue) {
        const fieldData = {
          key: field,
          label: labelInfo.label,
          value: dataValue,
        };

        if (labelInfo.type === "Edit") {
          editData.push(fieldData);
        } else if (labelInfo.type === "Relisted Reason") {
          if (labelInfo.name == labelsPolicy.manualApplicationForm.name) {
            relistData.push({
              key: field,
              label: labelInfo.label,
              value:
                dataValue + ": " + data.manualApplicationFormDetails,
            });
          } else {
            relistData.push(fieldData);
          }
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
        await submitFeedback(params?.id, "PolicyOwnerDetails", payload);
        await toast.success("Policy owner details review success", {
          description: "Reviews posted successfully!",
        });
        goToNextTab();
      } catch (error: any) {
        await toast.error("Policy owner details failure!", {
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

                {Object.values(labelsPolicy)
                  .filter((field) => {
                    if (field.name === "usIndicia") {
                      return personalDetail?.residence;
                    }
                    if (field.name === 'manualApplicationForm') {
                      return !hasManualApp;
                    }
                    return true;
                  })
                  .map((field) => (
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
                      description={descriptionPolicy(
                        field.name,
                        selectedProposal,
                        personalDetail,
                        personalInfo,
                        occupations,
                      )}
                      selectOptions={field.options}
                      readOnly={field.type === ""}
                      useTextInput={["Edit"].includes(field.type)}
                    />
                  ))}

                {manualApplicationForm === "No" && (
                  <div className="flex mt-2">
                    <div className="w-1/2" />
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="manualApplicationFormDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                placeholder="Comment on your selection"
                                {...field}
                                className="w-full h-auto p-2 border border-gray-300 rounded resize-y"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

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
              {_.isEmpty(documents) && !loading ? (
                <SuccessOrErrorState
                  state="empty"
                  message="No documents found"
                />
              ) : (
                <ProposalDocuments doctypes={doctypes} docUserType="OWNER" />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
