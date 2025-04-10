import { FormatDob, FormatGender, GetLookupValue } from "@/lib";
import { z } from "zod";

export const schemaPolicy = z.object({
  documentType: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  surname: z.string().optional(),
  sex: z.string().optional(),
  identificationNumber: z.string().optional(),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  krapin: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().optional(),
  occupation: z.string().optional(),
  residence: z.string().optional(),
  usIndicia: z.string().optional(),
  businessPersonIndustry: z.string().optional(),
  manualApplicationForm: z.string().optional(),
  manualApplicationFormDetails: z.string().optional(),
});

export const fieldsPolicy = {
  documentType: "Yes",
  firstName: "Yes",
  middleName: "Yes",
  surname: "Yes",
  sex: "Yes",
  identificationNumber: "Yes",
  dob: "Yes",
  nationality: "Yes",
  krapin: "Yes",
  phoneNumber: "Yes",
  emailAddress: "Yes",
  residence: "Yes",
  occupation: "Yes",
  usIndicia: "Yes",
  businessPersonIndustry: "Yes",
  manualApplicationForm: "Yes",
  manualApplicationFormDetails: "Yes",
};

export const labelsPolicy = {
  documentType: {
    name: "documentType",
    label: "Document Type",
    type: "Relisted Reason",
    options: [
      "Incorrect identification document",
      "Unclear identification document",
      "Missing/incomplete identification document",
    ],
  },
  firstName: {
    name: "firstName",
    label: "First Name",
    type: "Edit",
    options: [],
  },
  middleName: {
    name: "middleName",
    label: "Middle Name",
    type: "Edit",
    options: [],
  },
  surname: {
    name: "surname",
    label: "Last Name",
    type: "Edit",
    options: [],
  },
  sex: {
    name: "sex",
    label: "Gender",
    type: "Relisted Reason",
    options: ["Wrong gender"],
  },
  dob: {
    name: "dob",
    label: "Date of Birth",
    type: "Relisted Reason",
    options: [
      "Date of Birth is inconsistent with the ID copy",
      "Date of Birth is inconsistent with our records",
      "Date of Birth is inconsistent with government records",
      "Date of Birth is inconsistent with the application form",
    ],
  },
  identificationNumber: {
    name: "identificationNumber",
    label: "Identification Number",
    type: "Edit",
    options: [],
  },
  nationality: {
    name: "nationality",
    label: "Nationality",
    type: "Edit",
    options: [],
  },
  krapin: {
    name: "krapin",
    label: "KRA PIN",
    type: "Relisted Reason",
    options: [
      "Invalid KRA pin",
      "KRA pin on the portal differs with the application form",
    ],
  },
  phoneNumber: {
    name: "phoneNumber",
    label: "Phone Number",
    type: "Relisted Reason",
    options: [
      "Wrong phone number",
      "Phone number is inconsistent with our records",
      "Mobile number on the portal differs with the application form",
    ],
  },
  emailAddress: {
    name: "emailAddress",
    label: "Email Address",
    type: "Relisted Reason",
    options: [
      "Wrong email address",
      "Email address is inconsistent with our records",
      "Email on the portal differs with the application form",
    ],
  },
  occupation: {
    name: "occupation",
    label: "Occupation",
    type: "Relisted Reason",
    options: ["Missing occupation details on application form"],
  },
  residence: {
    name: "residence",
    label: "Are you a US Citizen?",
    type: "Relisted Reason",
    options: ["Capture the postal address on application form"],
  },
  usIndicia: {
    name: "usIndicia",
    label: "US Indicia",
    type: "Relisted Reason",
    options: [
      "Incorrect indicia form",
      "Missing indicia form",
      "Unclear indicia form",
      "Tick on the application form",
      "Response ticked on the application form differs with the portal",
    ],
  },
  businessPersonIndustry: {
    name: "businessPersonIndustry",
    label: "Business Person Industry",
    type: "Relisted Reason",
    options: ["Specify the business industry on application form"],
  },
  manualApplicationForm: {
    name: "manualApplicationForm",
    label: "Manual Application Form",
    type: "Relisted Reason",
    options: [
      "Incorrect manual application form",
      "Unclear manual application form",
      "Missing/incomplete manual application form",
    ],
  },
};

export function descriptionPolicy(
  field: string,
  selectedProposal?: any,
  personalDetail?: any,
  personalInfo?: any,
  occupations?: any
): string {
  switch (field) {
    case "documentType":
      return personalInfo?.documentType || "-";
    case "manualApplicationForm":
      return "MANUAL_APPLICATION_FORM";
    case "firstName":
      return selectedProposal?.firstName || "-";
    case "middleName":
      return selectedProposal?.middleName || "-";
    case "surname":
      return selectedProposal?.surname || "-";
    case "sex":
      return FormatGender(selectedProposal?.sex) || "-";
    case "dob":
      return FormatDob(selectedProposal?.dob) || "-";
    case "identificationNumber":
      return personalInfo?.identificationNumber || "-";
    case "nationality":
      return personalInfo?.nationality || "-";
    case "krapin":
      return personalDetail?.kraPin || "-";
    case "phoneNumber":
      return selectedProposal?.phoneNumber || "-";
    case "emailAddress":
      return selectedProposal?.emailAddress || "-";
    case "occupation":
      return GetLookupValue(occupations, personalDetail?.occupation) || "-";
    case "usIndicia":
    case "residence":
      return personalDetail?.residence ? "Yes" : "No";
    case "businessPersonIndustry":
      return personalDetail?.businessPersonIndustry || "-";

    default:
      return "-";
  }
}
