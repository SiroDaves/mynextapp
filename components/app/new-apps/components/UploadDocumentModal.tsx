"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProposalStore } from "@/state/proposal/proposal";
import { UploadDocumentRequest } from "@/state/proposal/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  doctype: z.any(),
  file: z.any(),
});

export const UploadDocumentModal = ({ }) => {
  const params = useParams<{ id: string }>();
  const [fileBase64String, setFileBase64String] = useState<any>();
  const [contentType, setContentType] = useState<any>();
  const {
    submit,
    selectedProposal,
    personalDetail,
    proposalModals,
    uploadDocument,
    fetchDocuments,
    toggleProposalModal,
  } = useProposalStore();

  const onClose = async () => {
    await toggleProposalModal({ uploadDocuments: false });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  const onImageChange = (e: any) => {
    encodeFileBase64(e.target.files[0]);
  };

  const encodeFileBase64 = (file: any) => {
    var reader = new FileReader();
    if (file) {
      setContentType(file.type);
      reader.readAsDataURL(file);
      reader.onload = () => {
        var base64 = reader.result;
        if (typeof base64 === "string") {
          var base64Content = base64.split(",")[1];
          setFileBase64String(base64Content);
        }
      };
      reader.onerror = (error: any) => {
        toast.error("Something went wrong!", {
          description: error?.response?.data?.description,
        });
      };
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let type = data.doctype;
    try {
      const data: UploadDocumentRequest = {
        header: {
          documentType: "Correspondence",
          refID: personalDetail?.identificationNumber,
          entityID: personalDetail?.identificationNumber,
          entityName:
            selectedProposal?.firstName + " " + selectedProposal?.surname,
          username:
            selectedProposal?.firstName + " " + selectedProposal?.surname,
          lobID: "4",
          documentName: "Correspondence",
          BPMRef: null,
          contextID: selectedProposal?.policyNumber,
          properties: null,
        },
        filecontent: fileBase64String,
      };
      console.log(contentType);
      await uploadDocument(params.id, personalDetail?.identificationNumber, type, "OWNER", contentType, fileBase64String);
      await fetchDocuments(params.id);
      await onClose();
    } catch (error: any) {
      toast.error("Something went wrong!", {
        description: error?.response?.data?.description,
      });
    }
  };

  return (
    <Dialog open={proposalModals?.uploadDocuments} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle className="font-medium text-center">
            Upload Bridger Document
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8">
            <div className="">
              <FormField
                control={form.control}
                name="doctype"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue="Not Selected">
                        <SelectItem value="BRIDGER_REPORT_PAYER">
                          Bridger Report Payer
                        </SelectItem>
                        <SelectItem value="BRIDGER_REPORT_OWNER">
                          Bridger Report Owner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          //multiple
                          placeholder="shadcn"
                          {...fileRef}
                          onChange={onImageChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full text-white mt-10"
              disabled={submit}
            >
              {submit && (
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
