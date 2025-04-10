type Document = {
  id: number;
  name: string;
  documentType: string;
  imageNowDocumentID: string;
  contentType: string;
};

export function documentTypeExist(documents: Document[], documentTypesToCheck: string[]): boolean {
  return documents.some(doc => documentTypesToCheck.includes(doc.documentType));
}