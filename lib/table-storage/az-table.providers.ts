import { Provider } from "@nestjs/common";
import { AZ_TABLE_STORAGE_NAME } from "./az-table.constant";
import { AzTableStorageRepository } from "./az-table.repository";
import { AzTableStorageService } from "./az-table.service";


export function createRepositoryProviders(entity: Function): Provider [] {
    return [getRepositoryProvider(entity)];
}

export function getRepositoryProvider(entity: Function): Provider {
    const provide = getRepositoryToken(entity);
    const o = {
        provide,
        useFactory: (service: AzTableStorageService, tableName: string) => {
            return new AzTableStorageRepository(service, tableName);
        },
        inject: [AzTableStorageService, AZ_TABLE_STORAGE_NAME],
    };
    return o;
}

export function getRepositoryToken(entity: Function) {
    return `${entity.name}AzTableStorageRepository`;
}