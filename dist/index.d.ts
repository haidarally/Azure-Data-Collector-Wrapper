import { APIResponse } from "./Response";
export declare class DataCollectorClient {
    private readonly workspaceId;
    private readonly sharedKey;
    private readonly serviceName?;
    constructor(workspaceId: string, sharedKey: string, serviceName?: string | undefined);
    /**
     *
     * @param logType Specify the record type of the data that is being submitted. Can only contain letters, numbers, and underscore (_), and may not exceed 100 characters.
     * @param logs The logs in JSON array
     * @param timeGenerated The name of a field in the data that contains the timestamp of the data item. If you specify a field then its contents are used for TimeGenerated. If this field isn’t specified, the default for TimeGenerated is the time that the message is ingested. The contents of the message field should follow the ISO 8601 format YYYY-MM-DDThh:mm:ssZ.
     *
     * @returns An object contains http status and status code
     */
    send(logType: string, logs: any[], timeGenerated?: string): Promise<APIResponse>;
}
