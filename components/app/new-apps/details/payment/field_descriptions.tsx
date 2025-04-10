import { FormatCurrency, FormatDob, FormatFrequency } from "@/lib";

export function descriptionMpesa(
  field: string,
  selectedProposal?: any
): string {
  switch (field) {
    case "paymentMethod":
    case "subsequentPaymentMode":
      return "MOBILE_PAYMENT";
    case "premium":
      return FormatCurrency(selectedProposal?.quoteDetail?.premium);
    default:
      return "-";
  }
}

export function descriptionCheckOff(
  field: string,
  checkOff?: any,
  selectedProposal?: any
): string {
  switch (field) {
    case "paymentMethod":
    case "subsequentPaymentMode":
      return "CHECK_OFF";
    case "schemeName":
      return checkOff?.schemeName || "-";

    case "schemeNumber":
      return checkOff?.schemeNumber || "-";

    case "payrollNo":
      return checkOff?.payrollNo || "-";

    case "deductionMonth":
      return checkOff?.deductionMonth || "-";

    case "deductionYear":
      return checkOff?.deductionYear || "-";

    case "premium":
      return FormatCurrency(selectedProposal?.quoteDetail?.premium);

    case "amount":
      return FormatCurrency(checkOff?.amount);

    default:
      return "-";
  }
}

export function descriptionDirectDebit(
  field: string,
  directDebit?: any,
  personalDetail?: any,
  selectedProposal?: any
): string {
  switch (field) {
    case "paymentMethod":
    case "subsequentPaymentMode":
      return "DIRECT_DEBIT";
    case "accountName":
      return directDebit?.accountName || "-";

    case "accountNumber":
      return directDebit?.accountNumber || "-";

    case "bankName":
      return directDebit?.bankName || "-";

    case "bankNumber":
      return directDebit?.bankNumber || "-";

    case "branchName":
      return directDebit?.branchName || "-";

    case "branchNumber":
      return directDebit?.branchNumber || "-";

    case "collectionDate":
      return FormatDob(directDebit?.collectionDate);

    case "frequency":
      return FormatFrequency(directDebit?.frequency) || "-";

    case "sourceOfFunds":
      return personalDetail?.sourceOfFunds;

    case "premium":
      return FormatCurrency(selectedProposal?.quoteDetail?.premium);

    case "amount":
      return FormatCurrency(directDebit?.amount);

    default:
      return "-";
  }
}

export function descriptionCheque(
  field: string,
  selectedProposal?: any,
  personalDetail?: any
): string {
  switch (field) {
    case "paymentMethod":
    case "subsequentPaymentMode":
      return "CHEQUE";
    case "sourceOfFunds":
      return personalDetail?.sourceOfFunds;
    case "premium":
      return FormatCurrency(selectedProposal?.quoteDetail?.premium);
    default:
      return "-";
  }
}

export function descriptionRtgs(
  field: string,
  selectedProposal?: any,
  personalDetail?: any
): string {
  switch (field) {
    case "paymentMethod":
    case "subsequentPaymentMode":
      return "RGTS";
    case "sourceOfFunds":
      return personalDetail?.sourceOfFunds;
    case "premium":
      return FormatCurrency(selectedProposal?.quoteDetail?.premium);
    default:
      return "-";
  }
}
