import { ComponentType } from "react";
import { v2, WrappedDocument, OpenAttestationDocument, v3 } from "@tradetrust-tt/tradetrust";
import { SignedVerifiableCredential } from "@trustvc/trustvc";

export type Attachment = v2.Attachment | v3.Attachment;
export interface Renderer {
  attachment: Attachment;
}

export interface TemplateProps<D extends OpenAttestationDocument | SignedVerifiableCredential> {
  document: D;
  wrappedDocument?: WrappedDocument<OpenAttestationDocument> | SignedVerifiableCredential;
  handleObfuscation: (field: string) => void;
  errorType?: string;
}

export interface Template {
  id: string;
  label: string;
}
export interface TemplateWithComponent<D extends OpenAttestationDocument | SignedVerifiableCredential>
  extends Template {
  template: ComponentType<TemplateProps<D>>;
  predicate?: ({ document }: { document: D }) => boolean;
}

export interface TemplateRegistry<D extends OpenAttestationDocument | SignedVerifiableCredential> {
  [key: string]: TemplateWithComponent<D>[];
}

export interface TemplateWithTypes<D extends OpenAttestationDocument | SignedVerifiableCredential>
  extends TemplateWithComponent<D> {
  type: string;
}
