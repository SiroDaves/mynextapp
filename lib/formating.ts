import { Occupation } from "@/state/document/types";
import { useProposalStore } from "@/state/proposal/proposal";
import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import _ from "lodash";

dayjs.extend(customParseFormat);

export const FormatDob = (dob?: string) => {
  const parsedDate = dayjs(dob, {
    format: "YYYYMMDDHHmmssSSS",
  });

  return parsedDate.format("DD-MMM-YYYY");
};

export const formatDates = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const FormatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toString();
};

export const calculateBMI = (height: number, weight: number) => {
  if (height <= 0 || weight <= 0) {
    return "0.0";
  }
  const heightInMeter = height / 100;
  const bmi = weight / (heightInMeter * heightInMeter);
  return bmi.toFixed(2).toString();
};

export const FormatGender = (genderCode: string) => {
  const upperCaseCode = genderCode?.toUpperCase();
  if (upperCaseCode === "M") {
    return "Male";
  } else if (upperCaseCode === "F") {
    return "Female";
  } else {
    return "Unknown";
  }
};
export const GetLookupValue = (
  lookups: Occupation[] | null | undefined,
  itemCode: string
) => {
  if (!lookups) {
    return "-";
  }
  const lookup = lookups.find((lookup) => lookup.itemCode === itemCode);
  return lookup ? lookup.itemDescription : "-";
};

export const FormatFrequency = (interval: number) => {
  switch (interval) {
    case 3:
      return "Quarterly";
    case 6:
      return "Biannualy";
    case 12:
      return "Annualy";
    case 99:
      return "Single Premium";
    default:
      return "Monthly";
  }
};

export const FormatCurrency = (amount: number): string => {
  return amount?.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    currencyDisplay: "code",
  });
};

export const FormatButtonTitle = (
  subsequent?: boolean,
  firstSubsequentDifferent?: boolean
): string => {
  if (subsequent) {
    return "Next";
  } else {
    return firstSubsequentDifferent ? "Save Review" : "Next";
  }
};

export const getDoctype = (paymentMode: string) => {
  switch (paymentMode) {
    case "CHECK_OFF":
      return "CHECK_OFF_FORM";
    case "DIRECT_DEBIT":
      return "DIRECT_DEBIT_FORM";
    case "CHEQUE":
      return "CHEQUE";
    case "RTGS":
      return "RTGS";
    default:
      return "";
  }
};
export function CapitalizeWords(input: string) {
  let words = input.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (words[i]) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  }
  return words.join(" ");
}

export const GetLookupDescription = (itemCode: any, lookupList: any) => {
  for (let i = 0; i < lookupList?.length; i++) {
    if (lookupList[i]?.itemCode === itemCode) {
      return lookupList[i]?.itemDescription;
    }
  }
  return itemCode;
};

export const FormatTabTitle = (documentType: string) => {
  switch (documentType) {
    case "IDENTIFICATION_DOCUMENT":
      return "Identification Kenyan/Alien";
    case "US_INDICIA_FORM":
      return "US Indicia Form";
    case "CHECK_OFF_FORM":
      return "Check-Off Forms";
    case "DIRECT_DEBIT_FORM":
      return "Direct Debit Forms";
    case "SOURCE_OF_FUNDS_DOCUMENT":
      return "Source of Funds";
    case "APPLICATION_DOCUMENT":
      return "Application Document";
    case "FINANCIAL_QUESTIONNAIRE":
      return "Financial Questionnaire";
    case "BRIDGER_REPORT_PAYER":
      return "Bridger Report Payer";
    case "BRIDGER_REPORT_OWNER":
      return "Bridger Report Owner";
    case "MANUAL_APPLICATION_FORM":
      return "Manual Application Forms";
    case "OTHERS":
      return "Other Documents";
    default:
      return documentType.toString();
  }
};

export const doctypeExist = (doctypes: string[]): boolean => {
  const finalTypes: any[] = [];
  const { documents, loading } = useProposalStore();
  if (!_.isEmpty(documents) && !loading) {
    for (const document of documents) {
      if (doctypes.some((doctype) => doctype === document.documentType)) {
        finalTypes.push(document);
      }
    }
    if (finalTypes.length === 0) {
      return false;
    }
  }
  return true;
};
