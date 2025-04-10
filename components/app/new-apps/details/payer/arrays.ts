import { FormatDob, FormatGender, GetLookupValue } from "@/lib";
import { z } from "zod";

export const schemaPayer = z.object({
  dateOfBirth: z.string().optional(),
  documentType: z.string().optional(),
  emailAddress: z.string().optional(),
  firstname: z.string().optional(),
  surname: z.string().optional(),
  identificationNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  relationship: z.string().optional(),
  residentialAddress: z.string().optional(),
  salutation: z.string().optional(),
  sex: z.string().optional(),
  taxNumber: z.string().optional(),
});

export const fieldsPayer = {
  dateOfBirth: "Yes",
  documentType: "Yes",
  emailAddress: "Yes",
  firstname: "Yes",
  surname: "Yes",
  identificationNumber: "Yes",
  phoneNumber: "Yes",
  occupation: "Yes",
  maritalStatus: "Yes",
  relationship: "Yes",
  residentialAddress: "Yes",
  salutation: "Yes",
  sex: "Yes",
  taxNumber: "Yes",
};

export const labelsPayer = {
  documentType: {
    name: "documentType",
    label: "Document Type",
    type: "Relisted Reason",
    options: [
      "Incorrect payer identification document",
      "Unclear payer identification document",
      "Missing/incomplete payer identification document",
    ],
  },
  identificationNumber: {
    name: "identificationNumber",
    label: "ID Number",
    type: "Edit",
    options: [],
  },
  phoneNumber: {
    name: "phoneNumber",
    label: "Phone Number",
    type: "Relisted Reason",
    options: [
      "Wrong payer phone number",
      "Phone number is payer inconsistent with our records",
    ],
  },
  emailAddress: {
    name: "emailAddress",
    label: "Email Address",
    type: "Relisted Reason",
    options: [
      "Wrong payer email address",
      "Payer email address is inconsistent with our records",
    ],
  },
  taxNumber: {
    name: "taxNumber",
    label: "KRA PIN",
    type: "",
    options: [],
  },
  dateOfBirth: {
    name: "dateOfBirth",
    label: "Date Of Birth",
    type: "Edit",
    options: [],
  },
  firstname: {
    name: "firstname",
    label: "First Name",
    type: "Edit",
    options: [],
  },
  surname: {
    name: "surname",
    label: "Last Name",
    type: "Edit",
    options: [],
  },
  occupation: {
    name: "occupation",
    label: "Occupation",
    type: "",
    options: [],
  },
  relationship: {
    name: "relationship",
    label: "Relationship",
    type: "",
    options: [],
  },
  sex: {
    name: "sex",
    label: "Gender",
    type: "Edit",
    options: [],
  },
};

export function descriptionPayer(
  field: string,
  payerDetails?: any,
  occupations?: any,
  maritals?: any,
  relationships?: any
): string {
  console.log(relationships);
  console.log(GetLookupValue(relationships, payerDetails?.relationship));
  switch (field) {
    case "dateOfBirth":
      return FormatDob(payerDetails?.dateOfBirth) || "-";

    case "documentType":
      return payerDetails?.documentType || "-";

    case "emailAddress":
      return payerDetails?.emailAddress || "-";

    case "phoneNumber":
      return payerDetails?.phoneNumber || "-";

    case "firstname":
      return payerDetails?.firstName || "-";

    case "surname":
      return payerDetails?.surname || "-";

    case "identificationNumber":
      return payerDetails?.identificationNumber || "-";

    case "occupation":
      return GetLookupValue(occupations, payerDetails?.occupation) || "-";

    case "maritalStatus":
      return GetLookupValue(maritals, payerDetails?.maritalStatus) || "-";

    case "relationship":
      return GetLookupValue(relationships, payerDetails?.relationship) || "-";

    case "residentialAddress":
      return payerDetails?.residentialAddress || "-";

    case "salutation":
      return payerDetails?.salutation || "-";

    case "sex":
      return FormatGender(payerDetails?.sex) || "-";

    case "taxNumber":
      return payerDetails?.taxNumber || "-";

    default:
      return "-";
  }
}
