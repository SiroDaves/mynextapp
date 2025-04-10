"use client";
import { VerticalDescriptionPanel } from "@/components/reusable";
import { CustomeTable } from "@/components/reusable/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InvestmentCodes } from "@/constants/plan_codes";
import { Contains, FormatCurrency } from "@/lib";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import {
  descriptionPlan,
  fieldsPlan,
  labelsPlan,
  relistFieldsPlan,
  schemaPlan,
} from ".";
import { ProposalDocuments, RadioTextInput } from "../../components";

interface PlanDetailsProps {
  goToNextTab: () => void;
}

type AddInputFormValues = z.infer<typeof schemaPlan>;

export const PlanDetails: FC<PlanDetailsProps> = ({ goToNextTab }) => {
  const params = useParams<{ id: string }>();

  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaPlan),
    mode: "onChange",
  });

  const [showFields, setShowFields] = useState(fieldsPlan);

  const {
    selectedProposal,
    hasManualApp,
    planDetails,
    riders,
    loading,
    agentDetails,
    submitFeedback,
  } = useProposalStore();

  function hasMandatoryRiders(benfNo: string) {
    for (let i = 0; i < riders?.length; i++) {
      if (riders[i]?.benfNo == benfNo && riders[i]?.mandatory === "Y") {
        return true;
      }
    }
    return false;
  }

  function getBenfDescn(benfNo: string) {
    for (let i = 0; i < riders?.length; i++) {
      if (riders[i].benfNo == benfNo) {
        return riders[i].benfDescn;
      }
    }
    return null;
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "planName",
      header: "Plan Name",
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {getBenfDescn(row.original?.benfNo)}
          </span>
        );
      },
    },
    {
      accessorKey: "mandatory",
      header: "Benefit Type",
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {hasMandatoryRiders(row.original?.benfNo)
              ? "Mandatory"
              : "Optional"}
          </span>
        );
      },
    },
    {
      accessorKey: "sumAssured",
      header: "Sum Assured",
      cell: ({ row }) => {
        return <span>{FormatCurrency(Number(row.original?.sumAssured))}</span>;
      },
    },
  ];

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
  };

  const getInitValue = (fieldName: string) => {
    return showFields[fieldName as keyof typeof showFields] || "Yes";
  };

  const onSubmit = async (data: AddInputFormValues) => {
    const editData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const dataValue = data[field as keyof AddInputFormValues] as string;
      if (showFields[field as keyof typeof showFields] === "No" && dataValue) {
        const labelInfo = labelsPlan[field as keyof typeof labelsPlan];
        const fieldData = {
          key: field,
          label: labelInfo.label,
          value: dataValue,
        };

        relistData.push(fieldData);
      }
    }

    if (editData.length === 0 && relistData.length === 0) {
      goToNextTab();
    } else {
      const payload = [];
      if (relistData.length > 0) {
        payload.push({
          changeType: "ReviewRelist",
          proposalReview: relistData,
        });
      }

      console.log(JSON.stringify(payload));

      try {
        await submitFeedback(params?.id, "PlanDetails", payload);
        await toast.success("Plan details review success", {
          description: "Reviews posted successfully!",
        });
        goToNextTab();
      } catch (error: any) {
        await toast.error("Plan details failure!", {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <VerticalDescriptionPanel
                label="Plan Number"
                spaced
                description={selectedProposal?.quoteDetail?.planNo}
              />
              <VerticalDescriptionPanel
                label="Plan Name"
                spaced
                description={selectedProposal?.quoteDetail?.planName}
              />
              <VerticalDescriptionPanel
                label="Policy Number"
                spaced
                description={selectedProposal?.policyNumber}
              />
              <VerticalDescriptionPanel
                label="Quote Status"
                spaced
                description={selectedProposal?.quoteStatus}
              />

              <VerticalDescriptionPanel
                label="Created By"
                spaced
                description={
                  agentDetails?.FIRST_NAME +
                  " " +
                  agentDetails?.MIDDLE_NAME +
                  " " +
                  agentDetails?.LAST_NAME
                }
              />
              <VerticalDescriptionPanel
                label="Contract Number"
                spaced
                description={selectedProposal?.contractNumber}
              />
            </div>

            <Card className="rounded-m border-black px-4 py-6 mt-4">
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

              {Object.values(labelsPlan)
                .filter((field) => field.name !== "planDetailsComment")
                .map((field) => (
                  <RadioTextInput
                    key={field.name}
                    name={field.name}
                    label={
                      field.name === "sumAssured"
                        ? Contains(
                            InvestmentCodes,
                            selectedProposal?.quoteDetail?.planNo
                          )
                          ? "Target"
                          : field.label
                        : field.label
                    }
                    type={field.type}
                    control={form.control}
                    initValue={getInitValue(field.name)}
                    onValueChange={(value) =>
                      handleRadioChange(field.name, value)
                    }
                    description={descriptionPlan(
                      field.name,
                      selectedProposal?.quoteDetail
                    )}
                    selectOptions={
                      field.name === "sumAssured"
                        ? Contains(
                            InvestmentCodes,
                            selectedProposal?.quoteDetail?.planNo
                          )
                          ? [
                              "Wrong target",
                              "Missing Sum assured on the application form",
                            ]
                          : [
                              "Wrong sum assured",
                              "Missing Sum assured on the application form",
                            ]
                        : field.options
                    }
                    useTextInput={!relistFieldsPlan.includes(field.name)}
                  />
                ))}
            </Card>

            <div className="pt-2 mt-4">
              {!(
                _.isEmpty(planDetails?.quotation?.riskCoversList?.riskCovers) ||
                _.isEmpty(riders)
              ) && (
                <Card className="rounded-m border-black px-4 py-6">
                  <CustomeTable
                    columns={columns}
                    data={planDetails?.quotation?.riskCoversList?.riskCovers}
                    pagination={planDetails}
                  />
                </Card>
              )}

              <div className="flex items-center justify-center m-4">
                <div className="items-stretch space-x-2 w-full">
                  <RadioTextInput
                    key={labelsPlan.planDetailsComment.name}
                    name={labelsPlan.planDetailsComment.name}
                    label={labelsPlan.planDetailsComment.label}
                    type={labelsPlan.planDetailsComment.type}
                    control={form.control}
                    initValue={getInitValue(labelsPlan.planDetailsComment.name)}
                    onValueChange={(value) =>
                      handleRadioChange(
                        labelsPlan.planDetailsComment.name,
                        value
                      )
                    }
                    description={descriptionPlan(
                      labelsPlan.planDetailsComment.name,
                      selectedProposal?.quoteDetail
                    )}
                    hideRadioLabels={false}
                    useTextArea={true}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center m-4">
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
