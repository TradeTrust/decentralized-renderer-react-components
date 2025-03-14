import { RefObject, useCallback, useEffect, useState } from "react";
import { connectToParent, connectToChild, ErrorCode } from "penpal";
import { PenpalError } from "penpal/lib/types";
import connectToChildV4 from "penpal-v4/lib/connectToChild";
import { FrameActionsHandler, LegacyFrameActions } from "./frame.actions";
import { HostActionsHandler, LegacyHostActions } from "./host.actions";
import { inIframe } from "../../utils";
import { getLogger } from "../../logger";

const { trace } = getLogger("useFrame");
const TIMEOUT = 5000;

type Status = "TIMEOUT" | "DISCONNECTED" | "CONNECTING" | "CONNECTED";

interface UseParentFrameProps {
  dispatch: HostActionsHandler;
}
export const useParentFrame = function ({
  dispatch,
}: UseParentFrameProps): [boolean, { dispatch: FrameActionsHandler }] {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    if (inIframe() && status === "DISCONNECTED") {
      const parentV5 = connectToParent({
        methods: {
          dispatch: dispatch,
        },
        timeout: TIMEOUT, // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      setStatus("CONNECTING");

      parentV5
        .then((parentConnection) => {
          trace("connectToParent success: ", parentConnection);
          setParentFrameConnection(parentConnection);
          setStatus("CONNECTED");
        })
        .catch((err: PenpalError) => {
          trace("connectToParent failed: ", err);
          if (err.code === ErrorCode.ConnectionTimeout) {
            setStatus("TIMEOUT");
          } else {
            setStatus("DISCONNECTED");
          }
        });
    }
  }, [status, dispatch]);
  return [status === "CONNECTED", parentFrameConnection];
};

interface UseChildrenFrameProps {
  dispatch: FrameActionsHandler;
  methods: LegacyFrameActions;
  iframe: RefObject<HTMLIFrameElement>;
}
export const useChildFrame = function (
  props: UseChildrenFrameProps,
): [
  boolean,
  boolean,
  { dispatch?: HostActionsHandler } & Partial<LegacyHostActions>,
  (newIframe: HTMLIFrameElement | null) => void,
] {
  const [childFrameConnection, setChildFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(props.iframe.current);

  const updateIframeRef = useCallback(
    (newIframe: HTMLIFrameElement | null) => {
      if (newIframe !== iframeRef) {
        setIframeRef(newIframe);
        setStatus("DISCONNECTED");
      }
    },
    [iframeRef],
  );

  useEffect(() => {
    if (iframeRef && status === "DISCONNECTED") {
      const childV5 = connectToChild({
        methods: {
          dispatch: props.dispatch,
          ...props.methods,
        },
        iframe: iframeRef,
        timeout: TIMEOUT, // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      const childV4 = connectToChildV4({
        methods: {
          dispatch: props.dispatch,
          ...props.methods,
        },
        iframe: iframeRef,
        timeout: TIMEOUT, // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      setStatus("CONNECTING");

      Promise.any([childV5, childV4])
        .then((childConnection) => {
          trace("connectToChild success: ", childConnection);
          setChildFrameConnection(childConnection);
          setStatus("CONNECTED");
        })
        .catch((err: AggregateError) => {
          trace("connectToChild failed: ", err);
          if (err.errors.map((e: PenpalError) => e.code).some((c) => c === ErrorCode.ConnectionTimeout)) {
            setStatus("TIMEOUT");
          } else {
            setStatus("DISCONNECTED");
          }
        });
    }
  }, [status, iframeRef, props.methods, props.dispatch]);
  return [status === "CONNECTED", status === "TIMEOUT", childFrameConnection, updateIframeRef];
};
