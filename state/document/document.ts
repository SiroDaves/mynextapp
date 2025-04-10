import { getApi } from "@/lib/api";
import { getURL } from "@/lib/string";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DocumentState {
  loading: boolean;
  loadingSubsequnt: boolean;
  documentData: any | null;
  secondDocument: any | null;
  documents: any | null;

  viewDocument: (
    quoteId: string,
    documentType: string,
    documentUserType: string
  ) => Promise<any>;
  viewSecondDocument: (
    quoteId: string,
    documentType: string,
    documentUserType: string
  ) => Promise<any>;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      loading: false,
      loadingSubsequnt: false,
      documents: null,
      documentData: null,
      secondDocument: null,

      viewDocument: async (
        quoteId: string,
        documentType: string,
        documentUserType: string
      ) => {
        set({ loading: true });
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
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loading: false, documentData: null });
            return reject(error);
          }
        });
      },

      viewSecondDocument: async (
        quoteId: string,
        documentType: string,
        documentUserType: string
      ) => {
        set({ loadingSubsequnt: true });
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
              secondDocument: response.data,
              loadingSubsequnt: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({ loadingSubsequnt: false, secondDocument: null });
            return reject(error);
          }
        });
      },
    }),
    {
      name: "my-app:document",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        documents: state.documents,
      }),
    }
  )
);
