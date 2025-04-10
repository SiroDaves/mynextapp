"use client";
import { SuccessOrErrorState } from "@/components/reusable/SuccessErrorState";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormatTabTitle } from "@/lib/formating";
import { useDocumentStore } from "@/state/document/document";
import { useProposalStore } from "@/state/proposal/proposal";
import _ from "lodash";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface ProposalDocumentProps {
  doc: any;
  docUserType: string;
}

export const ProposalDocument: FC<ProposalDocumentProps> = ({
  doc,
  docUserType,
}) => {
  const params = useParams<{ id: string }>();
  const { documentData, loading, viewDocument } = useDocumentStore();

  useEffect(() => {
    const fetchDocumentAsync = async () => {
      try {
        await viewDocument(params.id, doc?.documentType, docUserType);
      } catch (error: any) {
        console.log(
          `{'Fetching the document failed: ${error?.response?.data?.description}'}`
        );
      }
    };
    fetchDocumentAsync();
  }, [params?.id]);

  if (loading) {
    return (
      <Skeleton
        count={20}
        height={20}
        baseColor="#EEEEEE"
        highlightColor="#0077BE"
      />
    );
  }
  let documents = documentData?.documentContent?.split(";");

  const renderContent = () => {
    switch (documentData.documentType) {
      case "OTHERS":
      case "BRIDGER_REPORT_PAYER":
      case "BRIDGER_REPORT_OWNER":
      case "APPLICATION_DOCUMENT":
      case "MANUAL_APPLICATION_FORM":
        return (
          <div>
            {_.isEmpty(documents) && !loading ? (
              <SuccessOrErrorState state="empty" message="No Documents Found" />
            ) : (
              <div>
                {documents.map((document: any, index: any) => (
                  <iframe
                    src={`data:application/pdf;base64,${document}`}
                    width="100%"
                    allowFullScreen
                    className="h-screen"
                  ></iframe>
                ))}
              </div>
            )}
          </div>
        );

      default:
        if (_.isEmpty(documents)) {
          return (
            <SuccessOrErrorState state="empty" message="No documents found" />
          );
        } else {
          return (
            <div className="container mx-auto mt-4">
              <div className="image-slider">
                <Carousel
                  showArrows={true}
                  showThumbs={true}
                  showStatus={true}
                  dynamicHeight={true}
                >
                  {documents.map((document: any, index: any) => (
                    <div key={index} className="">
                      <div className="">
                        <img
                          src={`data:image/png;base64,${document}`}
                          alt="slides"
                        />
                        {documents.length > 1 && (
                          <p className="legend">
                            Image {index + 1} of {documents.length}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          );
        }
    }
  };

  return (
    <Card className="rounded-m border-grey">
      {_.isEmpty(documentData) && !loading ? (
        <SuccessOrErrorState state="empty" message="No documents found" />
      ) : (
        renderContent()
      )}
    </Card>
  );
};

interface ProposalDocumentsProps {
  doctypes: string[];
  docUserType: string;
}

export const ProposalDocuments: FC<ProposalDocumentsProps> = ({
  doctypes,
  docUserType,
}) => {
  const finalTabs: any[] = [];
  const { documents, loading } = useProposalStore();

  for (const document of documents) {
    if (doctypes.some((doctype) => doctype === document.documentType)) {
      finalTabs.push(document);
    }
  }

  const uniqueFinalTabs = _.uniqBy(finalTabs, "documentType");
  return (
    <div>
      {_.isEmpty(finalTabs) && !loading ? (
        <SuccessOrErrorState state="empty" message="No documents found" />
      ) : (
        <Tabs defaultValue={finalTabs[0].documentType} className="w-full">
          <div className="w-full flex-1 rounded-lg bg-white items-center">
            <TabsList className="flex  justify-between bg-white">
              <div className="flex justify-between">
                {uniqueFinalTabs.map((finalTab) => (
                  <TabsTrigger
                    className="data-[state=active]:bg-gray-300 px-5 py-2"
                    value={finalTab.documentType}
                  >
                    {FormatTabTitle(finalTab.documentType)}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </div>
          {finalTabs.map((finalTab) => (
            <TabsContent
              value={finalTab.documentType}
              className="bg-white rounded-xl"
            >
              <ProposalDocument doc={finalTab} docUserType={docUserType} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
