import { OperationOptions } from "@azure/core-client";
import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { CreateTableEntityResponse, DeleteTableEntityOptions, DeleteTableEntityResponse, GetAccessPolicyResponse, GetTableEntityOptions, GetTableEntityResponse, ListTableEntitiesOptions, SetAccessPolicyResponse, SignedIdentifier, TableDeleteEntityHeaders, TableEntity, TableEntityResult, TableEntityResultPage, TableInsertEntityHeaders, TableMergeEntityHeaders, TableTransactionResponse, TableUpdateEntityHeaders, TransactionAction, UpdateEntityResponse, UpdateMode, UpdateTableEntityOptions, UpsertEntityResponse } from "@azure/data-tables";
import { ModuleMetadata, Type } from "@nestjs/common";

export interface AzTableStorageOptions {
    account?: string;
    accountKey?: string;
    sasToken?: string;
    connectionString?: string;
    tableName?: string;
}

export interface AzTableStorageOptionsFactory {
    createAzTableStorageOptions(): Promise<AzTableStorageOptions> | AzTableStorageOptions;
}

export interface AzTableStorageModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<AzTableStorageOptionsFactory>;
    useClass?: Type<AzTableStorageOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<AzTableStorageOptions> | AzTableStorageOptions;
    inject?: any[];
}

export type ValueType = ((e: any) => string) | string;

export interface IAzTableClient {
    /**
     *  Creates a table with the tableName passed to the client constructor
     * @param options - The options parameters.
     *
     * * // calling create table will create the table used
     * // to instantiate the TableClient.
     * // Note: If the table already
     * // exists this function doesn't throw.
     * await client.createTable();
     * ```
     */
    createTable(options?: OperationOptions): Promise<void>;

    /**
     * Returns a single entity in the table.
     * @param partitionKey - The partition key of the entity.
     * @param rowKey - The row key of the entity.
     * @param options - The options parameters.
     *  * // getEntity will get a single entity stored in the service that
     * // matches exactly the partitionKey and rowKey used as parameters
     * // to the method.
     * const entity = await client.getEntity("<partitionKey>", "<rowKey>");
     * console.log(entity);
     * ```
     */
    getEntity<T extends object = Record<string, unknown>>(partitionKey: string, rowKey: string, options?: GetTableEntityOptions): Promise<GetTableEntityResponse<TableEntityResult<T>>>;

    /**
     * Queries entities in a table.
     * @param options - The options parameters.
     *
     *  * // list entities returns a AsyncIterableIterator
     * // this helps consuming paginated responses by
     * // automatically handling getting the next pages
     * const entities = client.listEntities();
     *
     * // this loop will get all the entities from all the pages
     * // returned by the service
     * for await (const entity of entities) {
     *    console.log(entity);
     * }
     * ```
     */
    listEntities<T extends object = Record<string, unknown>>(options?: ListTableEntitiesOptions): PagedAsyncIterableIterator<TableEntityResult<T>, TableEntityResultPage<T>>;

    /**
     * Insert entity in the table.
     * @param entity - The properties for the table entity.
     * @param options - The options parameters.
     *
     * *
     * // partitionKey and rowKey are required properties of the entity to create
     * // and accepts any other properties
     * await client.createEntity({partitionKey: "p1", rowKey: "r1", foo: "Hello!"});
     * ```
     */
    createEntity<T extends object>(entity: TableEntity<T>, options?: OperationOptions): Promise<CreateTableEntityResponse>;
    /**
     * Deletes the specified entity in the table.
     * @param partitionKey - The partition key of the entity.
     * @param rowKey - The row key of the entity.
     * @param options - The options parameters.
     *
     *  *
     * // deleteEntity deletes the entity that matches
     * // exactly the partitionKey and rowKey passed as parameters
     * await client.deleteEntity("<partitionKey>", "<rowKey>")
     * ```
     */
    deleteEntity(partitionKey: string, rowKey: string, options?: DeleteTableEntityOptions): Promise<DeleteTableEntityResponse>;
    /**
     * Update an entity in the table.
     * @param entity - The properties of the entity to be updated.
     * @param mode - The different modes for updating the entity:
     *               - Merge: Updates an entity by updating the entity's properties without replacing the existing entity.
     *               - Replace: Updates an existing entity by replacing the entire entity.
     * @param options - The options parameters.
     *
     *   *
     * // We can also set the update mode to Replace, which will match the entity passed
     * // to updateEntity with one stored in the service and replace with the new one.
     * // If there are any missing properties in the entity passed to updateEntity, they
     * // will be removed from the entity stored in the service
     * await client.updateEntity(entity, "Replace")
     * ```
     */
    updateEntity<T extends object>(entity: TableEntity<T>, mode?: UpdateMode, options?: UpdateTableEntityOptions): Promise<UpdateEntityResponse>;
    /**
     * Upsert an entity in the table.
     * @param entity - The properties for the table entity.
     * @param mode - The different modes for updating the entity:
     *               - Merge: Updates an entity by updating the entity's properties without replacing the existing entity.
     *               - Replace: Updates an existing entity by replacing the entire entity.
     * @param options - The options parameters.
     *
     *  * const entity = {partitionKey: "p1", rowKey: "r1", bar: "updatedBar"};
     *
     * // Upsert uses update mode "Merge" as default.
     * // This behaves similarly to update but creates the entity
     * // if it doesn't exist in the service
     * await client.upsertEntity(entity)
     *
     * // We can also set the update mode to Replace.
     * // This behaves similarly to update but creates the entity
     * // if it doesn't exist in the service
     * await client.upsertEntity(entity, "Replace")
     * ```
     */
    upsertEntity<T extends object>(entity: TableEntity<T>, mode?: UpdateMode, options?: OperationOptions): Promise<UpsertEntityResponse>;
    /**
     * Retrieves details about any stored access policies specified on the table that may be used with
     * Shared Access Signatures.
     * @param options - The options parameters.
     */
    getAccessPolicy(options?: OperationOptions): Promise<GetAccessPolicyResponse>;
    /**
     * Sets stored access policies for the table that may be used with Shared Access Signatures.
     * @param tableAcl - The Access Control List for the table.
     * @param options - The options parameters.
     */
    setAccessPolicy(tableAcl: SignedIdentifier[], options?: OperationOptions): Promise<SetAccessPolicyResponse>;
    /**
     * Submits a Transaction which is composed of a set of actions. You can provide the actions as a list
     * or you can use {@link TableTransaction} to help building the transaction.
     *
     * Example usage:
     * ```typescript
     * const { TableClient } = require("@azure/data-tables");
     * const connectionString = "<connection-string>"
     * const tableName = "<tableName>"
     * const client = TableClient.fromConnectionString(connectionString, tableName);
     * const actions = [
     *    ["create", {partitionKey: "p1", rowKey: "1", data: "test1"}],
     *    ["delete", {partitionKey: "p1", rowKey: "2"}],
     *    ["update", {partitionKey: "p1", rowKey: "3", data: "newTest"}, "Merge"]
     * ]
     * const result = await client.submitTransaction(actions);
     * ```
     *
     * Example usage with TableTransaction:
     * ```js
     * const { TableClient } = require("@azure/data-tables");
     * const connectionString = "<connection-string>"
     * const tableName = "<tableName>"
     * const client = TableClient.fromConnectionString(connectionString, tableName);
     * const transaction = new TableTransaction();
     * // Call the available action in the TableTransaction object
     * transaction.create({partitionKey: "p1", rowKey: "1", data: "test1"});
     * transaction.delete("p1", "2");
     * transaction.update({partitionKey: "p1", rowKey: "3", data: "newTest"}, "Merge")
     * // submitTransaction with the actions list on the transaction.
     * const result = await client.submitTransaction(transaction.actions);
     * ```
     *
     * @param actions - tuple that contains the action to perform, and the entity to perform the action with
     */
    submitTransaction(actions: TransactionAction[]): Promise<TableTransactionResponse>;
}

export interface Repository<T extends object> {
    //TODO: add support for odata //

    findAll(tableQuery?: ListTableEntitiesOptions | undefined): PagedAsyncIterableIterator<TableEntityResult<T>, TableEntityResultPage<T>, PageSettings>;
    find(partitionKey: string, rowKey: string, options?: GetTableEntityOptions | undefined): Promise<GetTableEntityResponse<TableEntityResult<T>>>;
    create(entity: TableEntity<T>, options?: OperationOptions | undefined): Promise<TableInsertEntityHeaders>
    update(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: UpdateTableEntityOptions | undefined): Promise<TableUpdateEntityHeaders>;
    upsert(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: OperationOptions | undefined): Promise<TableMergeEntityHeaders>;
    delete(partitionKey: string, rowKey: string, options?: DeleteTableEntityOptions | undefined): Promise<TableDeleteEntityHeaders>;
}