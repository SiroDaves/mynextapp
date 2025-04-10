"use client";
import { DataTable } from "@/components/reusable/DataTable";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormatButtonTitle, FormatCurrency } from "@/lib";
import { useProposalStore } from "@/state/proposal/proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { z } from "zod";
import {
  descriptionMpesa,
  getFieldsMpesa,
  getLabelsMpesa,
  getSchemaMpesa,
} from ".";
import { RadioTextInput } from "../../components";

interface MpesaDetailsProps {
  subsequent?: boolean;
  firstSubsequentDifferent?: boolean;
  onNextAction: () => void;
}

export const MpesaDetails: FC<MpesaDetailsProps> = ({
  subsequent = false,
  firstSubsequentDifferent = true,
  onNextAction,
}) => {
  const params = useParams<{ id: string }>();
  const schemaMpesa = useMemo(() => getSchemaMpesa(subsequent), [subsequent]);
  const fieldsMpesa = getFieldsMpesa(subsequent);
  const labelsMpesa = getLabelsMpesa(subsequent);

  type AddInputFormValues = z.infer<typeof schemaMpesa>;
  const form = useForm<AddInputFormValues>({
    resolver: zodResolver(schemaMpesa),
    mode: "onChange",
  });

  const [showFields, setShowFields] = useState(fieldsMpesa);

  const handleRadioChange = (field: string, value: string) => {
    setShowFields((prev) => ({ ...prev, [field]: value }));
  };

  const { selectedProposal, mpesaPayment, loading, submitFeedback } =
    useProposalStore();

  const onSubmit = async (data: AddInputFormValues) => {
    const editData: { key: string; label: string; value: string }[] = [];
    const relistData: { key: string; label: string; value: string }[] = [];

    for (const field of Object.keys(showFields)) {
      const labelInfo = labelsMpesa[field as keyof typeof labelsMpesa];
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return <span>{FormatCurrency(Number(row.original?.amount))}</span>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => {
        return <span>{row.original?.phoneNumber}</span>;
      },
    },
    {
      accessorKey: "mpesaReceiptNumber",
      header: "Mpesa Receipt Number",
      cell: ({ row }) => {
        return <span>{row.original?.mpesaReceiptNumber}</span>;
      },
    },
  ];

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
    <div className="px-2 py-6 w-full">
      {subsequent ? (
        <div></div>
      ) : (
        <Card className="rounded-m border-black px-4 py-6 mb-5">
          {_.isEmpty(mpesaPayment) && !loading ? (
            <SuccessOrErrorState
              state="empty"
              message="No transaction for mobile payment found"
            />
          ) : (
            <DataTable columns={columns} data={mpesaPayment} />
          )}
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-3/4">
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

            {Object.values(labelsMpesa).map((field) => (
              <RadioTextInput
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                control={form.control}
                initValue={"Yes"}
                onValueChange={(value) => handleRadioChange(field.name, value)}
                description={descriptionMpesa(field.name, selectedProposal)}
                selectOptions={field.options}
                readOnly={field.type === ""}
                useTextInput={["Edit"].includes(field.type)}
              />
            ))}
          </div>
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
    </div>
  );
};
