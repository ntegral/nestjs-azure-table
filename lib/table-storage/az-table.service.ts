import { OperationOptions } from "@azure/core-client";
import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { AzureNamedKeyCredential, AzureSASCredential, DeleteTableEntityOptions, GetAccessPolicyResponse, GetTableEntityOptions, GetTableEntityResponse, ListTableEntitiesOptions, SignedIdentifier, TableClient, TableDeleteEntityHeaders, TableEntity, TableEntityResult, TableEntityResultPage, TableInsertEntityHeaders, TableMergeEntityHeaders, TableSetAccessPolicyHeaders, TableTransactionResponse, TableUpdateEntityHeaders, TransactionAction, UpdateMode, UpdateTableEntityOptions } from "@azure/data-tables";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { AZ_TABLE_STORAGE_MODULE_OPTIONS } from "./az-table.constant";
import { AzTableStorageOptions, IAzTableClient } from "./az-table.interface";


const logger = new Logger(`AzTableStorageService`);

@Injectable()
export class AzTableStorageService implements IAzTableClient {
    
    private tableClient!: TableClient;

    constructor(@Inject(AZ_TABLE_STORAGE_MODULE_OPTIONS) private options: AzTableStorageOptions) {
        this.tableClient = this.getTableClientInstance(options);
    }

    getTableClientInstance(options: AzTableStorageOptions) {
        /// Connection String ///
        if (options?.connectionString && options?.tableName) {
            return TableClient.fromConnectionString(options.connectionString, options.tableName);
        } /// Shared Key Credential
        else if (options?.account && options?.accountKey && options?.tableName) {
            const sharedKeyCredential = new AzureNamedKeyCredential(options?.account, options?.accountKey);
            return new TableClient(`https://${options?.account}.table.core.windows.net`, `${options.tableName}`, sharedKeyCredential);
        } /// SaS Token
        else if (options?.account && options?.sasToken && options.tableName) {
            const sasCredential = new AzureSASCredential(options?.sasToken);
            return new TableClient(`https://${options?.account}.table.core.windows.net`,`${options.tableName}`, sasCredential);
        }
        throw new Error('configuration options error')
    }

    createTable(options?: OperationOptions): Promise<void> {
        return this.tableClient.createTable(options);
    }

    getEntity<T extends object = Record<string, unknown>>(partitionKey: string, rowKey: string, options?: GetTableEntityOptions | undefined): Promise<GetTableEntityResponse<TableEntityResult<T>>> {
        return this.tableClient.getEntity<T>(partitionKey,rowKey,options);
    }
    listEntities<T extends object = Record<string, unknown>>(options?: ListTableEntitiesOptions | undefined): PagedAsyncIterableIterator<TableEntityResult<T>, TableEntityResultPage<T>, PageSettings> {
        return this.tableClient.listEntities<T>(options);
    }
    createEntity<T extends object>(entity: TableEntity<T>, options?: OperationOptions | undefined): Promise<TableInsertEntityHeaders> {
        return this.tableClient.createEntity<T>(entity);
    }
    deleteEntity(partitionKey: string, rowKey: string, options?: DeleteTableEntityOptions | undefined): Promise<TableDeleteEntityHeaders> {
        return this.tableClient.deleteEntity(partitionKey, rowKey, options);
    }
    updateEntity<T extends object>(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: UpdateTableEntityOptions | undefined): Promise<TableUpdateEntityHeaders> {
        return this.tableClient.updateEntity<T>(entity, mode, options);
    }
    upsertEntity<T extends object>(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: OperationOptions | undefined): Promise<TableMergeEntityHeaders> {
        return this.tableClient.upsertEntity<T>(entity, mode, options);
    }
    getAccessPolicy(options?: OperationOptions | undefined): Promise<GetAccessPolicyResponse> {
        return this.tableClient.getAccessPolicy(options);
    }
    setAccessPolicy(tableAcl: SignedIdentifier[], options?: OperationOptions | undefined): Promise<TableSetAccessPolicyHeaders> {
        return this.tableClient.setAccessPolicy(tableAcl, options);
    }
    submitTransaction(actions: TransactionAction[]): Promise<TableTransactionResponse> {
        return this.tableClient.submitTransaction(actions);
    }
}