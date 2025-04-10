import { Pagination } from "@/components/reusable";
import { DataTable } from "@/components/reusable/DataTable";
import { Button } from "@/components/ui/button";
import { FormatCurrency } from "@/lib";
import { PaginationProps } from "@/lib/app";
import { useProposalStore } from "@/state/proposal/proposal";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { FC, useState } from "react";
import { ProposalDetailDrawer } from "../proposal/ProposalDetailDrawer";

interface NewAppsTableProps {
  data: any;
  detailsPage?: string;
  withPagination?: boolean;
  pagination: PaginationProps;
  onPaginationChange?: (page: number) => void;
}

export const NewAppsTable: FC<NewAppsTableProps> = ({
  data,
  detailsPage = "new-apps",
  withPagination,
  pagination,
  onPaginationChange,
}) => {
  const { fetchProposals } = useProposalStore();
  const { updateSelectedProposal, toggleProposalModal } = useProposalStore();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const viewNewApp = (row: any) => {
    updateSelectedProposal(row);
    router.push(`/${detailsPage}/${row?.id}`);
  };
  const searchProposal = async () => {
    await fetchProposals(undefined, {}, search);
  };
  const reset = async () => {
    await fetchProposals(undefined, {});
  };

  const showProposalDrawer = (row: any) => {
    updateSelectedProposal(row);
    toggleProposalModal({
      proposalDetails: true,
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "quoteNumber",
      header: "Proposal No.",
    },
    {
      accessorKey: "personalDetail",
      header: "Customer",
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {row.original?.firstName + " " + row.original?.surname}
          </span>
        );
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        return <span>{row.original?.quoteDetail?.planName}</span>;
      },
    },
    {
      accessorKey: "premium",
      header: "Premium",
      cell: ({ row }) => {
        return (
          <span>{FormatCurrency(row.original?.quoteDetail?.premium)}</span>
        );
      },
    },
    /*{
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => {
        return (
          <span>{FormatCurrency(row.original?.paymentMethod)}</span>
        );
      },
    },*/
    {
      accessorKey: "quoteStatus",
      header: "Status",
      cell: ({ row }) => {
        return <span>{FormatCurrency(row.original?.quoteStatus)}</span>;
      },
    },
    {
      accessorKey: "date",
      header: "Submitted At",
      cell: ({ row }) => {
        return (
          <span>
            {dayjs(row.original?.submittedAt).format("YYYY-MM-DD hh:mm A")}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant={"outline"}
              className="border-primary px-3 mr-1 text-primary hover:text-primary"
              size={"sm"}
              onClick={() => viewNewApp(row.original)}
            >
              View
            </Button>
            <Button
              variant={"outline"}
              className="border-destructive px-3 mr-1 text-destructive hover:text-destructive"
              size={"sm"}
              onClick={() => showProposalDrawer(row.original)}
            >
              Details
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <ProposalDetailDrawer />
      <form
        className="flex gap-3 flex-col md:flex-row space-x-2 w-1/2 mx-auto text-center mb-6 my-3 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          searchProposal();
        }}
      >
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent 
          px-3 py-1 text-sm shadow-sm transition-colors file:border-0 
         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50"
          id="link"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="submit"
          size={"sm"}
          variant={"outline"}
          className="border-primary text-primary border-2"
        >
          <SearchIcon size={15} className="mr-1" /> Search
        </Button>
        <Button
          type="reset"
          size={"sm"}
          onClick={() => reset()}
          variant={"outline"}
          className="border-destructive  text-destructive border-2 flex"
        >
          <XIcon size={15} className="mr-1" /> Reset
        </Button>
      </form>

      <DataTable columns={columns} data={data} />
      <div className="flex  justify-between items-center mt-2 ml-0.5 -mr-6">
        <>
          {pagination.totalElements > 10 && (
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pagination.size}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pagination.totalElements}
              </span>{" "}
              proposals
            </span>
          )}
        </>
        {withPagination && (
          <Pagination
            currentPage={pagination.number}
            totalPages={pagination.totalPages}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>
    </div>
  );
};
