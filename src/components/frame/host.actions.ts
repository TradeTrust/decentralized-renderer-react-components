// actions sent by host to frame
import { OpenAttestationDocument, WrappedDocument } from "@tradetrust-tt/tradetrust";
import { SignedVerifiableCredential } from "@trustvc/trustvc";
import { ActionType, createAction } from "typesafe-actions";

export const renderDocument = createAction("RENDER_DOCUMENT")<{
  document: OpenAttestationDocument | SignedVerifiableCredential;
  rawDocument?: WrappedDocument<OpenAttestationDocument> | SignedVerifiableCredential;
}>();

export const selectTemplate = createAction("SELECT_TEMPLATE")<string>();
export const getTemplates = createAction("GET_TEMPLATES")<OpenAttestationDocument | SignedVerifiableCredential>();
export const print = createAction("PRINT")();
export type HostActions = ActionType<
  typeof renderDocument | typeof selectTemplate | typeof getTemplates | typeof print
>;
export type HostActionsHandler = (action: HostActions) => void;

/**
 * @deprecated use HostActions
 */
export type LegacyHostActions = {
  renderDocument: (
    document: OpenAttestationDocument | SignedVerifiableCredential,
    rawDocument?: WrappedDocument<OpenAttestationDocument> | SignedVerifiableCredential,
  ) => void;
  selectTemplateTab: (tabIndex: number) => void;
  print: () => void;
};
