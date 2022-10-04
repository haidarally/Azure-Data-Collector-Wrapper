"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCollectorClient = void 0;
const crypto_1 = require("crypto");
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_VERSION = "2016-04-01";
class DataCollectorClient {
    constructor(workspaceId, sharedKey, serviceName) {
        this.workspaceId = workspaceId;
        this.sharedKey = sharedKey;
        this.serviceName = serviceName;
    }
    /**
     *
     * @param logType Specify the record type of the data that is being submitted. Can only contain letters, numbers, and underscore (_), and may not exceed 100 characters.
     * @param logs The logs in JSON array
     * @param timeGenerated The name of a field in the data that contains the timestamp of the data item. If you specify a field then its contents are used for TimeGenerated. If this field isn’t specified, the default for TimeGenerated is the time that the message is ingested. The contents of the message field should follow the ISO 8601 format YYYY-MM-DDThh:mm:ssZ.
     *
     * @returns An object contains http status and status code
     */
    async send(logType, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs, timeGenerated) {
        const postPayload = JSON.stringify(logs);
        const contentLength = Buffer.byteLength(postPayload, "utf8");
        const gmtTime = new Date().toUTCString();
        const stringToHash = [
            "POST",
            contentLength,
            "application/json",
            "x-ms-date:" + gmtTime,
            "/api/logs",
        ].join("\n");
        const signature = (0, crypto_1.createHmac)("sha256", Buffer.from(this.sharedKey, "base64"))
            .update(stringToHash, "utf8")
            .digest("base64");
        const authorization = `SharedKey ${this.workspaceId}:${signature}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: authorization,
            "Log-Type": this.serviceName ? `${this.serviceName}_${logType}` : logType,
            "x-ms-date": gmtTime,
            "time-generated-field": ""
        };
        if (timeGenerated) {
            headers["time-generated-field"] = timeGenerated;
        }
        const url = `https://${this.workspaceId}.ods.opinsights.azure.com/api/logs?api-version=${API_VERSION}`;
        const res = await (0, node_fetch_1.default)(url, {
            method: "post",
            body: postPayload,
            headers,
        });
        const { status, statusText } = res;
        if (status === 200) {
            return {
                code: 200,
                status: "OK",
            };
        }
        const { Error: errorCode, Message: errorMsg } = await res.json();
        return {
            code: status,
            status: statusText,
            errorCode,
            errorMsg,
        };
    }
}
exports.DataCollectorClient = DataCollectorClient;
