import { FormatCurrency, FormatFrequency } from "@/lib/formating";
import { z } from "zod";

export const schemaPlan = z.object({
  paymentFrequency: z.string().optional(),
  policyTerm: z.string().optional(),
  premium: z.string().optional(),
  sumAssured: z.string().optional(),
  planDetailsComment: z.string().optional(),
});

export const fieldsPlan = {
  paymentFrequency: "Yes",
  policyTerm: "Yes",
  premium: "Yes",
  sumAssured: "Yes",
  planDetailsComment: "Yes",
};

export const relistFieldsPlan = [
  "paymentFrequency",
  "policyTerm",
  "premium",
  "sumAssured",
];

export const labelsPlan = {
  paymentFrequency: {
    name: "paymentFrequency",
    label: "Payment Frequency",
    type: "Relisted Reason",
    options: ["Wrong frequency", "Missing frequency on the application form"],
  },
  policyTerm: {
    name: "policyTerm",
    label: "Policy Term",
    type: "Relisted Reason",
    options: ["Wrong policy term", "Missing term on the application form"],
  },
  premium: {
    name: "premium",
    label: "Premium",
    type: "Relisted Reason",
    options: ["Wrong premium", "Missing premium on the application form"],
  },
  sumAssured: {
    name: "sumAssured",
    label: "Sum Assured",
    type: "Relisted Reason",
    options: [
      "Wrong sum assured",
      "Wrong target",
      "Missing Sum assured on the application form",
    ],
  },
  planDetailsComment: {
    name: "planDetailsComment",
    label: "Are the plan details okay?",
    type: "Comment",
    options: [],
  },
};

export function descriptionPlan(field: string, quoteDetail?: any): string {
  switch (field) {
    case "paymentFrequency":
      return FormatFrequency(quoteDetail?.paymentFrequency);

    case "policyTerm":
      return quoteDetail?.policyTerm;

    case "premium":
      return FormatCurrency(quoteDetail?.premium);

    case "sumAssured":
      return FormatCurrency(quoteDetail?.sumAssured);

    default:
      return "";
  }
}
