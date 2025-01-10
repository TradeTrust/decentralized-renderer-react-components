import { v2 } from "@tradetrust-tt/tradetrust";
import { SignedVerifiableCredential } from "@trustvc/trustvc";
import React from "react";
import { fullAttachmentRenderer } from "./components/renderer/FullAttachmentRenderer";
import { noAttachmentRenderer } from "./components/renderer/NoAttachmentRenderer";
import { TemplateRegistry } from "./types";
import { documentTemplates, repeat } from "./utils";

describe("repeat", () => {
  it("should not call callback when times is 0", () => {
    const callback = jest.fn();
    repeat(0)(callback);
    expect(callback).toHaveBeenCalledTimes(0);
  });
  it("should not call callback when times is 3", () => {
    const callback = jest.fn();
    repeat(3)(callback);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe("documentTemplates", () => {
  const Component: React.FunctionComponent = () => <div>Hello</div>;
  it("should return foo templates", () => {
    const document: v2.OpenAttestationDocument = {
      issuers: [{ name: "name" }],
      $template: { name: "foo", type: v2.TemplateType.EmbeddedRenderer, url: "url" },
    };
    const templateRegistry: TemplateRegistry<any> = {
      foo: [{ id: "component-a", label: "Component A", template: Component }],
    };
    expect(documentTemplates(document, templateRegistry, noAttachmentRenderer)).toStrictEqual([
      {
        id: "component-a",
        label: "Component A",
        template: Component,
        type: "custom-template",
      },
    ]);
  });
  it("should return foo templates but filter out component-b", () => {
    const document: v2.OpenAttestationDocument = {
      issuers: [{ name: "name" }],
      $template: { name: "foo", type: v2.TemplateType.EmbeddedRenderer, url: "url" },
    };
    const templateRegistry: TemplateRegistry<any> = {
      foo: [
        { id: "component-a", label: "Component A", template: Component },
        { id: "component-b", label: "Component B", template: Component, predicate: () => false },
      ],
    };
    expect(documentTemplates(document, templateRegistry, noAttachmentRenderer)).toStrictEqual([
      {
        id: "component-a",
        label: "Component A",
        template: Component,
        type: "custom-template",
      },
    ]);
  });
  it("should return foo templates and attachments", () => {
    const document: v2.OpenAttestationDocument = {
      issuers: [{ name: "name" }],
      $template: { name: "foo", type: v2.TemplateType.EmbeddedRenderer, url: "url" },
      attachments: [
        { type: "application/pdf", filename: "abc.pdf", data: "data" },
        { type: "txt", filename: "abc.txt", data: "data" },
      ],
    };
    const templateRegistry: TemplateRegistry<any> = {
      foo: [
        { id: "component-a", label: "Component A", template: Component },
        { id: "component-b", label: "Component B", template: Component, predicate: () => false },
      ],
    };
    expect(documentTemplates(document, templateRegistry, fullAttachmentRenderer)).toStrictEqual([
      {
        id: "component-a",
        label: "Component A",
        template: Component,
        type: "custom-template",
      },
      expect.objectContaining({
        id: "attachment-0",
        label: "abc.pdf",
        type: "application/pdf",
      }),
      expect.objectContaining({
        id: "attachment-1",
        label: "abc.txt",
        type: "txt",
      }),
    ]);
  });
  it("should return foo templates and attachments for w3c vc", () => {
    const document: SignedVerifiableCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/bbs/v1",
        "https://w3id.org/vc/status-list/2021/v1",
        "https://trustvc.io/context/transferable-records-context.json",
        "https://trustvc.io/context/render-method-context.json",
        "https://trustvc.io/context/attachments-context.json",
        "https://schemata.openattestation.com/io/tradetrust/bill-of-lading/1.0/bill-of-lading-context.json",
      ],
      credentialStatus: {
        type: "TransferableRecords",
        tokenNetwork: {
          chain: "MATIC",
          chainId: "80002",
        },
        tokenRegistry: "0x3781bd0bbd15Bf5e45c7296115821933d47362be",
        tokenId: "e8ad3d0567f4e58a31f2f29e9be38b83527c6f76226d0d52a56935737979a21c",
      },
      renderMethod: [
        {
          id: "https://generic-templates.tradetrust.io",
          type: "EMBEDDED_RENDERER",
          templateName: "foo",
        },
      ],
      credentialSubject: {
        shipper: {
          address: {},
        },
        consignee: {},
        notifyParty: {},
        blNumber: "20250107",
        scac: "20250107",
        links: {
          self: {
            href: "https://actions.tradetrust.io?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2F91c8b97b-2a43-4c66-9cf7-b91ca0bd3813%22%2C%22key%22%3A%229428cac0631b4b0859e46abde7948449b79a2874a1ce4d4035fe75b35b3180a6%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%2220180427%22%7D%7D",
          },
        },
        attachments: [
          { type: "application/pdf", filename: "abc.pdf", data: "data" },
          { type: "txt", filename: "abc.txt", data: "data" },
        ],
      },
      issuanceDate: "2021-12-03T12:19:52Z",
      expirationDate: "2029-12-03T12:19:52Z",
      issuer: "did:web:trustvc.github.io:did:1",
      type: ["VerifiableCredential"],
      id: "urn:bnid:_:01943fab-749b-7116-b040-5f8051a33a12",
      proof: {
        type: "BbsBlsSignature2020",
        created: "2025-01-07T07:29:51Z",
        proofPurpose: "assertionMethod",
        proofValue: "",
        verificationMethod: "did:web:trustvc.github.io:did:1#keys-1",
      },
    };
    const templateRegistry: TemplateRegistry<any> = {
      foo: [
        { id: "component-a", label: "Component A", template: Component },
        { id: "component-b", label: "Component B", template: Component, predicate: () => false },
      ],
    };
    expect(documentTemplates(document, templateRegistry, fullAttachmentRenderer)).toStrictEqual([
      {
        id: "component-a",
        label: "Component A",
        template: Component,
        type: "custom-template",
      },
      expect.objectContaining({
        id: "attachment-0",
        label: "abc.pdf",
        type: "application/pdf",
      }),
      expect.objectContaining({
        id: "attachment-1",
        label: "abc.txt",
        type: "txt",
      }),
    ]);
  });
});
