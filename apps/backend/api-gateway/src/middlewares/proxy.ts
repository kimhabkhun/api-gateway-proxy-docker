import { ROUTE_PATH } from "@/route-defs";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import express, { Response } from "express";
// import { logRequest } from "@/utils/logger";
import { IncomingMessage } from "http";
// import { gatewayLogger } from "@/server";
interface ProxyConfigs {
  [context: string]: Options<IncomingMessage, Response>;
}

const proxyConfigs: ProxyConfigs = {
  [ROUTE_PATH.AUTH_SERVICE.path]: {
    target: ROUTE_PATH.AUTH_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATH.AUTH_SERVICE.path}${path}`;
    },
    // on: {
    //   proxyReq: (
    //     proxyReq: ClientRequest,
    //     _req: IncomingMessage,
    //     _res: Response
    //   ) => {
    //     //@ts-ignore
    //     logRequest(gatewayLogger, proxyReq, {
    //       protocol: proxyReq.protocol,
    //       host: proxyReq.getHeader("host"),
    //       path: proxyReq.path,
    //     });
    //   },
    //   proxyRes: (_proxyRes, _req, _res) => {},
    // },
  },
  [ROUTE_PATH.PRODUCT_SERVICE.path]: {
    target: ROUTE_PATH.PRODUCT_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATH.PRODUCT_SERVICE.path}${path}`;
    },
  },
};

export default function applyProxy(app: express.Application) {
  Object.keys(proxyConfigs).forEach((keyContext: string) => {
    //Apply proxy middleware
    // console.log(keyContext);
    // console.log(proxyConfigs[keyContext]);
    app.use(keyContext, createProxyMiddleware(proxyConfigs[keyContext]));
  });
}
