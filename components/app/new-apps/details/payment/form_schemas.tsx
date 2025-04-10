import { z } from "zod";

export const getSchemaMpesa = (subsequent: boolean) => {
  return z.object({
    ...(subsequent ?
      { subsequentPaymentMode: z.string().optional() } :
      { paymentMethod: z.string().optional() }),
    ...{ premium: z.string().optional() },
  });
};

export const getSchemaCheckOff = (subsequent: boolean) => {
  const commonFields = {
    schemeName: z.string().optional(),
    schemeNumber: z.string().optional(),
    payrollNo: z.string().optional(),
    deductionMonth: z.string().optional(),
    deductionYear: z.string().optional(),
    sourceOfFunds: z.string().optional(),
  };

  return z.object({
    ...(subsequent ?
      { subsequentPaymentMode: z.string().optional() } :
      { paymentMethod: z.string().optional() }),
    ...commonFields,
  });
};

export const getSchemaDirectDebit = (subsequent: boolean) => {
  const commonFields = {
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    bankNumber: z.string().optional(),
    branchName: z.string().optional(),
    branchNumber: z.string().optional(),
    collectionDate: z.string().optional(),
    frequency: z.string().optional(),
    sourceOfFunds: z.string().optional(),
  };

  return z.object({
    ...(subsequent ?
      { subsequentPaymentMode: z.string().optional() } :
      { paymentMethod: z.string().optional() }),
    ...commonFields,
  });
};

export const getSchemaCheque = (subsequent: boolean) => {
  return z.object({
    ...(subsequent ?
      { subsequentPaymentMode: z.string().optional() } :
      { paymentMethod: z.string().optional() }),
    ...{ premium: z.string().optional() },
  });
};

export const getSchemaRtgs = (subsequent: boolean) => {
  return z.object({
    ...(subsequent ?
      { subsequentPaymentMode: z.string().optional() } :
      { paymentMethod: z.string().optional() }),
    ...{ premium: z.string().optional() },
  });
};
