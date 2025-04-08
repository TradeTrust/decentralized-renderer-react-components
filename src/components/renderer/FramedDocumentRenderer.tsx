import React, { useCallback, useRef, useState } from "react";
import { Attachment, TemplateRegistry } from "../../types";
import { documentTemplates, noop } from "../../utils";
import { getLogger } from "../../logger";
import { HostActions } from "../frame/host.actions";
import { FrameActions, obfuscateField, updateHeight, updateTemplates } from "../frame/frame.actions";
import { HostConnector } from "../frame/HostConnector";
import { DomListener } from "../common/DomListener";
import { noAttachmentRenderer } from "./NoAttachmentRenderer";
import { OpenAttestationDocument, WrappedDocument, v2, v3 } from "@tradetrust-tt/tradetrust";
import { SignedVerifiableCredential } from "@trustvc/trustvc";

const { trace } = getLogger("FramedDocumentRenderer");

export function FramedDocumentRenderer<D extends v3.OpenAttestationDocument = v3.OpenAttestationDocument>({
  templateRegistry,
  attachmentToComponent,
}: {
  templateRegistry: TemplateRegistry<D>;
  attachmentToComponent?: (attachment: Attachment, document: D) => React.FunctionComponent | null;
}): JSX.Element;
export function FramedDocumentRenderer<D extends v2.OpenAttestationDocument = v2.OpenAttestationDocument>({
  templateRegistry,
  attachmentToComponent,
}: {
  templateRegistry: TemplateRegistry<D>;
  attachmentToComponent?: (attachment: Attachment, document: D) => React.FunctionComponent | null;
}): JSX.Element;
export function FramedDocumentRenderer<D extends SignedVerifiableCredential = SignedVerifiableCredential>({
  templateRegistry,
  attachmentToComponent,
}: {
  templateRegistry: TemplateRegistry<D>;
  attachmentToComponent?: (attachment: Attachment, document: D) => React.FunctionComponent | null;
}): JSX.Element;
export function FramedDocumentRenderer<D extends OpenAttestationDocument | SignedVerifiableCredential>({
  templateRegistry,
  attachmentToComponent = noAttachmentRenderer,
}: {
  templateRegistry: TemplateRegistry<D>;
  attachmentToComponent?: (attachment: Attachment, document: D) => React.FunctionComponent | null;
}): JSX.Element {
  const [document, setDocument] = useState<D>();
  const [timeout, setTimeout] = useState<boolean>(false);
  // used only to handle legacy setSelectTemplate function
  // dispatch function (below) is connected once through the frame and the reference to this function never change is
  // host and iframe. We need to use a reference to allow object mutation
  const documentForLegacyUsage = useRef<D>();
  const [rawDocument, setRawDocument] = useState<
    WrappedDocument<OpenAttestationDocument> | SignedVerifiableCredential
  >();
  const [templateName, setTemplateName] = useState<string>();
  const toHost = useRef<(actions: FrameActions) => void>(noop);

  const templates = document
    ? documentTemplates(document, templateRegistry as TemplateRegistry<D>, attachmentToComponent, timeout)
    : [];
  const templateConfiguration = templates.find((template) => template.id === templateName) || templates[0] || {};
  const Template = templateConfiguration.template;

  const onConnected = useCallback((postMessage: (actions: FrameActions) => void) => {
    toHost.current = postMessage;
  }, []);

  // actions received by the parent hosting the component
  const dispatch = useCallback(
    (action: HostActions): any => {
      trace("in frame, received action", action.type);
      if (action.type === "RENDER_DOCUMENT") {
        setDocument(action.payload.document as D);
        documentForLegacyUsage.current = action.payload.document as D;
        if (action.payload.rawDocument) {
          setRawDocument(action.payload.rawDocument as any);
        }

        setTimeout(!!action.payload.isTimeout);
        const run = async (): Promise<void> => {
          const templates = await documentTemplates(
            action.payload.document as D,
            templateRegistry as TemplateRegistry<D>,
            attachmentToComponent,
            action.payload.isTimeout,
          ).map((template) => ({
            id: template.id,
            label: template.label,
            type: template.type,
          }));
          toHost.current(updateTemplates(templates));
        };
        run();
      } else if (action.type === "SELECT_TEMPLATE") {
        setTemplateName(action.payload);
      } else if (action.type === "GET_TEMPLATES") {
        const templates = documentTemplates(
          action.payload as D,
          templateRegistry as TemplateRegistry<D>,
          attachmentToComponent,
          timeout,
        ).map((template) => ({
          id: template.id,
          label: template.label,
          type: template.type,
        }));
        toHost.current(updateTemplates(templates)); // send the result to the iframe
        return templates; // react-native expect to get the result directly
      } else if (action.type === "PRINT") {
        window.print();
      } else {
        throw new Error(`Action ${JSON.stringify(action)} is not handled`);
      }
    },
    [templateRegistry, attachmentToComponent, timeout],
  );
  window.openAttestation = dispatch; // expose different actions for direct injection

  return (
    <DomListener onUpdate={(height) => toHost.current(updateHeight(height))}>
      <HostConnector dispatch={dispatch} onConnected={onConnected}>
        {document && Template && (
          <div className="frameless-tabs" id="rendered-certificate">
            <Template
              document={document}
              wrappedDocument={rawDocument}
              handleObfuscation={(field) => toHost.current(obfuscateField(field))}
              errorType={timeout ? "TIMEOUT" : "MISSING_RENDERER_URL"}
            />
          </div>
        )}
      </HostConnector>
    </DomListener>
  );
}
