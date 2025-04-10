import { getApi } from "@/lib/api";
import { getURL } from "@/lib/string";
import { stringify } from "querystring";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MoveFilesRequest } from "./types";

interface ProposalState {
  proposals: any[];
  beneficiaries: any[];
  loading: boolean;
  documentLoading: boolean;
  hasManualApp: boolean;
  lookUpListLoading: boolean;
  submit: boolean;
  proposalModals: any;
  pagination: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  selectedProposal: any | null;
  selectedDocumentType: any | null;
  selectedDocument: any | null;
  personalDetail: any | null;
  personalInfo: any | null;
  documentData: any | null;
  documents: any | null;
  mpesaPayment: any | null;
  checkOff: any | null;
  directDebit: any | null;
  planDetails: any | null;
  payerDetails: any | null;
  agentDetails: any | null;
  lookupList: any | null;
  riders: any | null;
  reviews: any | null;
  relistReasons: any | null;
  medicalUWReview: any | null;
  medicalUWFeedback: any | null;

  toggleProposalModal: (payload: any) => void;
  updateSelectedDocument: (payload: any) => void;
  updateSelectedProposal: (payload: any) => void;
  setSelectedDocumentType: (payload: any) => void;
  fetchProposals: (
    status?: string,
    pagination?: any,
    searchParam?: any,
    category?: any
  ) => Promise<any>;
  fetchPersonalDetails: (quoteId: string) => Promise<any>;
  fetchPersonalInfo: (quoteId: string) => Promise<any>;
  fetchAgentDetails: (contractNumber: string) => Promise<any>;
  fetchLookUpList: (type: string) => Promise<any>;
  fetchPlanDetails: (quoteId: string) => Promise<any>;
  fetchPayerDetails: (quoteId: string) => Promise<any>;
  fetchRiders: (quoteId: string) => Promise<any>;
  viewDocument: (
    quoteId: string,
    documentType: string,
    documentUserType: string
  ) => Promise<any>;
  fetchDocuments: (quoteId: string) => Promise<any>;
  uploadDocument: (
    proposalId: string,
    identificationNumber: string,
    type: string,
    documentUserType: string,
    contentType: string,
    data: any
  ) => Promise<any>;
  moveDocument: (quoteId: string, type: string, data: any) => Promise<any>;
  createDocumentFolder: (
    quoteId: string,
    data: MoveFilesRequest
  ) => Promise<any>;
  fetchPayments: (quoteId: string) => Promise<any>;
  fetchCheckOff: (quoteId: string) => Promise<any>;
  fetchDirectDebit: (quoteId: string) => Promise<any>;
  sendPayment: (quoteId: string, paymentId: string) => Promise<any>;
  fetchRelistReasons: (quoteId: string) => Promise<any>;
  fetchReviews: (quoteId: string) => Promise<any>;
  reviewProposal: (quoteId: string, data: any) => Promise<any>;
  submitFeedback: (quoteId: string, step: string, data?: any) => Promise<any>;
  reviewAmlProposal: (quoteId: string, data: any) => Promise<any>;
  fetchBeneficiaries: (quoteId: string) => Promise<any>;
  fetchMedicalUWReview: (quoteId: string) => Promise<any>;
  fetchMedicalUWFeedback: (quoteId: string) => Promise<any>;
  reviewMedicalUWReview: (quoteId: string, data: any) => Promise<any>;
}

export const useProposalStore = create<ProposalState>()(
  persist(
    (set) => ({
      proposals: [],
      amlApps: [],
      beneficiaries: [],
      proposalModals: {
        showImages: false,
        reviewProposal: false,
        proposalDetails: false,
        uploadDocuments: false,
      },
      loading: false,
      documentLoading: false,
      hasManualApp: false,
      lookUpListLoading: false,
      submit: false,
      pagination: {
        number: 1,
        size: 12,
        totalElements: 0,
        totalPages: 0,
      },
      selectedProposal: null,
      selectedDocumentType: null,
      selectedDocument: null,
      personalDetail: null,
      personalInfo: null,
      documents: null,
      mpesaPayment: null,
      checkOff: null,
      directDebit: null,
      planDetails: null,
      payerDetails: null,
      agentDetails: null,
      riders: null,
      lookupList: null,
      reviews: null,
      relistReasons: null,
      documentData: null,
      medicalUWReview: null,
      medicalUWFeedback: null,

      toggleProposalModal: (payload) => {
        set((state) => ({
          proposalModals: {
            ...state.proposalModals,
            ...payload,
          },
        }));
      },
      updateSelectedProposal: (payload) => {
        set({ selectedProposal: payload });
      },
      updateSelectedDocument: (payload) => {
        set({ selectedDocument: payload });
      },
      setSelectedDocumentType: (payload) => {
        set({ selectedDocumentType: payload });
      },
      fetchProposals: async (
        status,
        pagination = {},
        searchParam,
        category
      ) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(`/api/v1/proposals`, {
              params: { ...pagination, status, q: searchParam, category },
            });
            set({
              proposals: response.data.content,
              pagination: {
                ...response.data.page,
                number: pagination.page || 1,
              },
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({
              loading: false,
              proposals: [],
            });
            return reject(error);
          }
        });
      },
      fetchPersonalDetails: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/customer-details`
            );
            set({
              personalDetail: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, personalDetail: null });
            return reject(error);
          }
        });
      },
      fetchPersonalInfo: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/personal-information`
            );
            set({
              personalInfo: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, personalInfo: null });
            return reject(error);
          }
        });
      },
      fetchPlanDetails: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/regenerate`
            );
            set({
              planDetails: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, planDetails: null });
            return reject(error);
          }
        });
      },
      fetchPayerDetails: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/payer`
            );
            set({
              payerDetails: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, payerDetails: null });
            return reject(error);
          }
        });
      },
      fetchAgentDetails: async (contractNumber: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("auth").get(
              `/api/v1/users/${contractNumber}/details`
            );
            set({
              agentDetails: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, agentDetails: null });
            return reject(error);
          }
        });
      },
      fetchLookUpList: async (listType: string) => {
        set({ lookUpListLoading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/look-up-list?search=${listType}`
            );
            set({
              lookupList: response.data,
              lookUpListLoading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ lookUpListLoading: false });
            return reject(error);
          }
        });
      },
      fetchRiders: async (planNo: string) => {
        const data = {
          planNo: planNo,
          smoker: "N",
          sex: "M",
          dob: "19850101000000",
          occupation: 100,
        };
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(`/api/v1/riders`, data);
            set({
              riders: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, riders: null });
            return reject(error);
          }
        });
      },

      fetchDocuments: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/documents`
            );
            set({
              hasManualApp: stringify(response.data).includes(
                "MANUAL_APPLICATION_FORM"
              ),
              documents: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, hasManualApp: false, documents: null });
            return reject(error);
          }
        });
      },
      viewDocument: async (
        quoteId: string,
        documentType: string,
        documentUserType: string
      ) => {
        set({ documentLoading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("application").get(
              getURL(`/api/getuploaddocument`, {
                documentUserType: documentUserType,
                documentType: documentType,
                proposalId: quoteId,
              }),
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            set({
              documentData: response.data,
              documentLoading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ documentLoading: false, documentData: null });
            return reject(error);
          }
        });
      },
      uploadDocument: async (
        proposalId,
        identificationNumber,
        type,
        documentUserType,
        contentType,
        data
      ) => {
        set({ submit: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("application").post(
              getURL(`/api/uploadDocument `),
              {
                proposalId: proposalId,
                identificationNumber: identificationNumber,
                documentType: type,
                documentUserType: documentUserType,
                contentType: contentType,
                documentContent: data,
              }
            );
            set((state) => ({
              submit: false,
              proposalModals: {
                ...state.proposalModals,
                showImages: false,
              },
            }));
            return resolve(response);
          } catch (error: any) {
            set({ submit: false });
            return reject(error);
          }
        });
      },
      moveDocument: async (quoteId, type, data) => {
        set({ loading: true });
        try {
          await getApi("cis").post(
            getURL(`/api/v1/proposals/${quoteId}/upload-documents`, {
              type: type,
            }),
            data
          );
          set((state) => ({
            loading: false,
            proposalModals: {
              ...state.proposalModals,
              showImages: false,
            },
          }));
        } catch (error: any) {
          set({ loading: false });
        }
      },
      createDocumentFolder: async (quoteId, data) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              getURL(`/api/v1/proposals/${quoteId}/move-documents`),
              data
            );
            set((state) => ({
              loading: false,
              selectedProposal: {
                ...state.selectedProposal,
                workflowId: response.data,
              },
              proposalModals: {
                ...state.proposalModals,
                showImages: false,
              },
            }));
            return resolve(response);
          } catch (error: any) {
            set({ loading: false });
            return reject(error);
          }
        });
      },
      fetchPayments: async (quoteId: string) => {
        set({ loading: true, mpesaPayment: null });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/payments`
            );
            set({
              mpesaPayment: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, mpesaPayment: null });
            return reject(error);
          }
        });
      },
      fetchCheckOff: async (quoteId: string) => {
        set({ loading: true, checkOff: null });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/check-off`
            );
            set({
              checkOff: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, checkOff: null });
            return reject(error);
          }
        });
      },
      fetchDirectDebit: async (quoteId: string) => {
        set({ loading: true, directDebit: null });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/direct-debit`
            );
            set({
              directDebit: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, directDebit: null });
            return reject(error);
          }
        });
      },
      sendPayment: async (quoteId: string, paymentId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              `/api/v1/quote/${quoteId}/payments/${paymentId}/post`
            );
            set((state) => ({
              mpesaPayment: state.mpesaPayment.map((payment: any) =>
                payment.id === response.data.id ? response.data : payment
              ),
              loading: false,
            }));
            return resolve(response);
          } catch (error: any) {
            set({ loading: false });
            return reject(error);
          }
        });
      },

      reviewProposal: async (quoteId: string, data: any) => {
        set({ submit: true });
        return new Promise(async (resolve, reject) => {
          try {
            console.log(data);
            console.log("in state");
            const response = await getApi("cis").post(
              `/api/v1/proposals/${quoteId}/review`,
              data
            );
            set({ submit: false });
            return resolve(response);
          } catch (error: any) {
            set({ submit: false });
            return reject(error);
          }
        });
      },
      submitFeedback: async (quoteId: string, step: string, data: any) => {
        set({ loading: true, submit: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              `/api/v1/proposals/${quoteId}/feedback?step=${step}`,
              data
            );
            set({ submit: false, loading: false });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, submit: false });
            return reject(error);
          }
        });
      },
      reviewAmlProposal: async (quoteId: string, data: any) => {
        set({ submit: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              `/api/v1/proposals/${quoteId}/feedback?step=Preview`,
              data
            );
            set({ submit: false });
            return resolve(response);
          } catch (error: any) {
            set({ submit: false });
            return reject(error);
          }
        });
      },
      fetchReviews: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/reviews`
            );
            set({
              reviews: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, reviews: null });
            return reject(error);
          }
        });
      },
      fetchRelistReasons: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/feedback`
            );
            set({
              relistReasons: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, relistReasons: null });
            return reject(error);
          }
        });
      },
      fetchBeneficiaries: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/${quoteId}/beneficiaries`
            );
            set({
              beneficiaries: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({
              loading: false,
              beneficiaries: [],
            });
            return reject(error);
          }
        });
      },

      reviewMedicalUWReview: async (
        quoteId: string,
        data: {
          status: string;
          message: string;
          relistedReason?: string;
          comment?: string;
        }
      ) => {
        set({ submit: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              `/api/v1/proposals/${quoteId}/review`,
              data
            );
            set({ submit: false });
            return resolve(response);
          } catch (error: any) {
            set({ submit: false });
            return reject(error);
          }
        });
      },

      fetchMedicalUWReview: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/reviews`
            );
            set({
              medicalUWReview: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, medicalUWReview: null });
            return reject(error);
          }
        });
      },

      fetchMedicalUWFeedback: async (quoteId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/proposals/${quoteId}/feedback`
            );
            set({
              medicalUWFeedback: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, medicalUWFeedback: null });
            return reject(error);
          }
        });
      },
    }),

    {
      name: "my-app:proposal",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedProposal: state.selectedProposal,
        personalDetail: state.personalDetail,
        personalInfo: state.personalInfo,
        agentDetails: state.agentDetails,
        payerDetails: state.payerDetails,
        riders: state.riders,
        reviews: state.reviews,
        documents: state.documents,
      }),
    }
  )
);
