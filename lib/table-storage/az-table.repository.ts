import { OperationOptions } from "@azure/core-client";
import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { ListTableEntitiesOptions, TableEntityResult, TableEntityResultPage, GetTableEntityOptions, GetTableEntityResponse, TableEntity, TableInsertEntityHeaders, UpdateMode, UpdateTableEntityOptions, TableUpdateEntityHeaders, TableMergeEntityHeaders, DeleteTableEntityOptions, TableDeleteEntityHeaders } from "@azure/data-tables";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { AZ_TABLE_STORAGE_NAME } from "./az-table.constant";
import { Repository } from "./az-table.interface";
import { AzTableStorageService } from "./az-table.service";

const logger = new Logger(`AzTableStorageRepository`);

@Injectable()
export class AzTableStorageRepository<T extends object> implements Repository<T> {

    constructor(private readonly manager: AzTableStorageService,
        @Inject(AZ_TABLE_STORAGE_NAME) private readonly tableName: string) {}

    findAll(tableQuery?: ListTableEntitiesOptions | undefined): PagedAsyncIterableIterator<TableEntityResult<T>, TableEntityResultPage<T>, PageSettings> {
        return this.manager.listEntities<T>(tableQuery);
    }

    async find(partitionKey: string, rowKey: string, options?: GetTableEntityOptions | undefined): Promise<GetTableEntityResponse<TableEntityResult<T>>> {
        logger.debug(`Looking for Entity PartitionKey=${partitionKey} RowKey=${rowKey} in ${this.tableName}`);
        return this.manager.getEntity<T>(partitionKey, rowKey, options);
    }
    async create(entity: TableEntity<T>, options?: OperationOptions | undefined): Promise<TableInsertEntityHeaders> {
        return this.manager.createEntity<T>(entity, options);
    }
    async update(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: UpdateTableEntityOptions | undefined): Promise<TableUpdateEntityHeaders> {
        return this.manager.updateEntity<T>(entity, mode, options);
    }
    async upsert(entity: TableEntity<T>, mode?: UpdateMode | undefined, options?: OperationOptions | undefined): Promise<TableMergeEntityHeaders> {
        return this.manager.upsertEntity<T>(entity, mode, options);
    }
    async delete(partitionKey: string, rowKey: string, options?: DeleteTableEntityOptions | undefined): Promise<TableDeleteEntityHeaders> {
        return this.manager.deleteEntity(partitionKey, rowKey, options);
    }
}