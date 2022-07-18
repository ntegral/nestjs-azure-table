import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { AzTableStorageCoreModule } from "./az-table-core.module";
import { AZ_TABLE_STORAGE_MODULE_OPTIONS, AZ_TABLE_STORAGE_NAME } from "./az-table.constant";
import { AzTableStorageModuleAsyncOptions, AzTableStorageOptions, AzTableStorageOptionsFactory } from "./az-table.interface";
import { AzTableStorageRepository } from "./az-table.repository";
import { AzTableStorageService } from "./az-table.service";

const PROVIDERS = [AzTableStorageService, AzTableStorageRepository];
const EXPORTS = [...PROVIDERS];

@Module({})
export class AzTableStorageModule {
    public static forRoot(options: AzTableStorageOptions): DynamicModule {
        return {
            module: AzTableStorageModule,
            imports: [AzTableStorageCoreModule.forRoot(options)],
        };
    }

    public static forRootAsync(options: AzTableStorageModuleAsyncOptions): DynamicModule {
        return {
            module: AzTableStorageCoreModule,
            imports: [AzTableStorageCoreModule.forRootAsync(options)],
        };
    }
}