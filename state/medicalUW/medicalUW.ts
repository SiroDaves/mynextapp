import { getApi } from "@/lib/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MedicalProposalState {
  proposals: any[];
  loading: boolean;
  pagination: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  selectedProposal: any | null;
  proposalModals: any;

  toggleProposalModal: (payload: any) => void;
  updateSelectedProposal: (payload: any) => void;
  fetchProposals: (
    status?: string,
    pagination?: any,
    searchParam?: any,
    category?: any
  ) => Promise<any>;
}

export const useMedicalProposalStore = create<MedicalProposalState>()(
  persist(
    (set) => ({
      proposals: [],
      proposalModals: {
        proposalDetails: false,
      },
      loading: false,
      pagination: {
        number: 1,
        size: 12,
        totalElements: 0,
        totalPages: 0,
      },
      selectedProposal: null,

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
      fetchProposals: async (
        status = 'RequireMedical',
        pagination = {},
        searchParam = '',
        
      ) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(`/api/v1/proposals`, {
              params: { ...pagination, status, q: searchParam },
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
    }),
    {
      name: "my-app:medical-proposal",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedProposal: state.selectedProposal,
      }),
    }
  )
);
