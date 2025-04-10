"use client";
import { VerticalDescriptionPanel } from "@/components/reusable";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { calculateBMI, DisplayQuestion } from "@/lib";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import { fieldsHealth, labelsHealth, schemaHealth } from ".";
import { ProposalDocuments, RadioTextInput } from "../../components";

interface HealthQuestionsProps {
  goToNextTab: () => void;
}

type AddInputFormValues = z.infer<typeof schemaHealth>;

export const HealthQuestions: FC<HealthQuestionsProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();

  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaHealth),
    mode: "onChange",
  });

  const [showFields, setShowFields] = useState(fieldsHealth);
  const [requiresMedicalQuestionnaire, setRequiresMedicalQuestionnaire] =
    useState("");

  const {
    loading,
    hasManualApp,
    selectedProposal,
    personalDetail,
    submitFeedback,
  } = useProposalStore();

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

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
    if (field === labelsHealth.requiresMedicalQuestionnaire.name) {
      setRequiresMedicalQuestionnaire(value);
    }
  };

  const getInitValue = (fieldName: string) => {
    return showFields[fieldName as keyof typeof showFields] || "No";
  };

  const onSubmit = async (data: AddInputFormValues) => {
    const medicalData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const dataValue = data[field as keyof AddInputFormValues] as string;
      if (showFields[field as keyof typeof showFields] === "Yes" && dataValue) {
        const labelInfo = labelsHealth[field as keyof typeof labelsHealth];
        const fieldData = {
          key: field,
          label: labelInfo.label,
          value: dataValue,
        };

        switch (labelInfo.name) {
          case labelsHealth.bmiData.name:
            relistData.push(fieldData);
            break;
          case labelsHealth.requiresMedicalUnderwriting.name:
            medicalData.push(fieldData);
            break;
          case labelsHealth.istheManualFormDCA.name:
            relistData.push(fieldData);
            break;
          case labelsHealth.isTheManualFormDeclarationOkay.name:
            relistData.push(fieldData);
            break;
          case labelsHealth.requiresMedicalQuestionnaire.name:
            relistData.push({
              key: field,
              label: labelInfo.label,
              value:
                dataValue + ": " + data.requiresMedicalQuestionnaireDetails,
            });
            break;
        }
      }
    }

    if (medicalData.length === 0 && relistData.length === 0) {
      goToNextTab();
    } else {
      const payload = [];
      if (medicalData.length > 0) {
        payload.push({ changeType: "Medical", proposalReview: medicalData });
      }
      if (relistData.length > 0) {
        payload.push({
          changeType: "ReviewRelist",
          proposalReview: relistData,
        });
      }

      try {
        await submitFeedback(params?.id, "HealthQuestions", payload);
        await toast.success("Health questions review success", {
          description: "Reviews posted successfully!",
        });
        goToNextTab();
      } catch (error: any) {
        await toast.error("Health questions failure!", {
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
    <section className="bg-white px-5 rounded-xl py-4 px">
      <div
        className={`col-span-3 grid gap-10 ${
          hasManualApp ? "md:grid-cols-2" : "md:grid-cols-1"
        }`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/4">
                  <VerticalDescriptionPanel
                    label="1. BMI"
                    spaced
                    description={
                      calculateBMI(
                        personalDetail?.healthQuestions?.height || 0,
                        personalDetail?.healthQuestions?.userWeight || 0
                      ) +
                      " for " +
                      (personalDetail?.healthQuestions?.height || 0) +
                      "cm" +
                      " and " +
                      (personalDetail?.healthQuestions?.userWeight || 0) +
                      "kg"
                    }
                  />
                </div>
                <div className="w-3/4">
                  {Object.values(labelsHealth)
                    .filter((field) => field.name === "bmiData")
                    .map((field) => (
                      <RadioTextInput
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        control={form.control}
                        hideRadioLabels={false}
                        initValue={getInitValue(field.name)}
                        onValueChange={(value) =>
                          handleRadioChange(field.name, value)
                        }
                        defaultValue="Yes"
                        selectOptions={field.options}
                        useTextInput={false}
                      />
                    ))}
                </div>
              </div>

              <div className="col-span-3 grid md:grid-cols-2 gap-10">
                <VerticalDescriptionPanel
                  label={
                    "2. a) " + DisplayQuestion("hasConsultedDoctorLast10Years")
                  }
                  spaced
                  description={
                    personalDetail?.healthQuestions
                      ?.hasConsultedDoctorLast10Years
                      ? "Yes"
                      : "No"
                  }
                />
                <VerticalDescriptionPanel
                  label={"b) " + DisplayQuestion("doctorConsultationDetails")}
                  spaced
                  description={
                    personalDetail?.healthQuestions?.doctorConsultationDetails
                  }
                />
              </div>

              <VerticalDescriptionPanel
                label={"3. " + DisplayQuestion("hasHealthConditions")}
                spaced
                description={
                  personalDetail?.healthQuestions?.hasHealthConditions
                    ? "Yes"
                    : "No"
                }
              />

              <div className="col-span-3 grid md:grid-cols-2 gap-10">
                <VerticalDescriptionPanel
                  label={"4. a) " + DisplayQuestion("hasTobaccoAlcoholDrugUse")}
                  spaced
                  description={
                    personalDetail?.healthQuestions?.hasTobaccoAlcoholDrugUse
                      ? "Yes"
                      : "No"
                  }
                />
                <VerticalDescriptionPanel
                  label={
                    "b) " + DisplayQuestion("tobaccoAlcoholDrugUseDetails")
                  }
                  spaced
                  description={
                    personalDetail?.healthQuestions
                      ?.tobaccoAlcoholDrugUseDetails
                  }
                />
              </div>

              <div className="col-span-3 grid md:grid-cols-2 gap-10">
                <VerticalDescriptionPanel
                  label={"5. " + DisplayQuestion("hasFamilyMedicalHistory")}
                  spaced
                  description={
                    personalDetail?.healthQuestions?.hasFamilyMedicalHistory
                      ? "Yes"
                      : "No"
                  }
                />
                <VerticalDescriptionPanel
                  label={"b) " + DisplayQuestion("familyMedicalHistoryDetails")}
                  spaced
                  description={
                    personalDetail?.healthQuestions?.familyMedicalHistoryDetails
                  }
                />
              </div>

              <VerticalDescriptionPanel
                label={"6. " + DisplayQuestion("otherAbnormalities")}
                spaced
                description={
                  personalDetail?.healthQuestions?.otherAbnormalities
                    ? "Yes"
                    : "No"
                }
              />

              <div className="col-span-3 grid md:grid-cols-2 gap-10">
                <VerticalDescriptionPanel
                  label={"7. a) " + DisplayQuestion("isPregnant")}
                  spaced
                  description={selectedProposal.isPregnant ? "Yes" : "No"}
                />
                <VerticalDescriptionPanel
                  label={"b) " + DisplayQuestion("pregnancyWeeks")}
                  spaced
                  description={selectedProposal?.pregnancyWeeks || 0}
                />
              </div>

              <VerticalDescriptionPanel
                label={
                  "8. " + DisplayQuestion("hasEngagedInHazardousActivities")
                }
                spaced
                description={
                  personalDetail?.healthQuestions
                    ?.hasEngagedInHazardousActivities
                    ? "Yes"
                    : "No"
                }
              />
            </div>

            <div className="mb-5"></div>

            <div className="flex">
              <div className="items-stretch space-x-2 w-full">
                {Object.values(labelsHealth)
                  .filter((field) => field.name !== "bmiData")
                  .map((field) => (
                    <RadioTextInput
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      control={form.control}
                      hideRadioLabels={false}
                      initValue={getInitValue(field.name)}
                      onValueChange={(value) =>
                        handleRadioChange(field.name, value)
                      }
                      defaultValue="Yes"
                      selectOptions={field.options}
                      useTextInput={
                        ![
                          "requiresMedicalQuestionnaire",
                          "isTheManualFormDeclarationOkay",
                          "istheManualFormDCA",
                        ].includes(field.name)
                      }
                    />
                  ))}

                {requiresMedicalQuestionnaire === "Yes" && (
                  <div className="flex mt-2">
                    <div className="w-1/2" />
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="requiresMedicalQuestionnaireDetails"
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

                <div className="flex items-center justify-center m-4">
                  <Button
                    type="submit"
                    variant={"outline"}
                    className="border-primary text-primary rounded-lg px-14"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
        {!loading && hasManualApp && (
          <div className="px-2 py-6">
            <ProposalDocuments
              doctypes={["MANUAL_APPLICATION_FORM"]}
              docUserType="OWNER"
            />
          </div>
        )}
      </div>
    </section>
  );
};
