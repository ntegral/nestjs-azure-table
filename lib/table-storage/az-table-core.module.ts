import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { AZ_TABLE_STORAGE_MODULE_OPTIONS, AZ_TABLE_STORAGE_NAME } from "./az-table.constant";
import { AzTableStorageModuleAsyncOptions, AzTableStorageOptions, AzTableStorageOptionsFactory } from "./az-table.interface";
import { AzTableStorageModule } from "./az-table.module";
import { AzTableStorageRepository } from "./az-table.repository";
import { AzTableStorageService } from "./az-table.service";

const PROVIDERS = [AzTableStorageService, AzTableStorageRepository];
const EXPORTS = [...PROVIDERS];

@Global()
@Module({})
export class AzTableStorageCoreModule {

  static forRoot(options?: AzTableStorageOptions): DynamicModule {
      return {
        module: AzTableStorageModule,
        providers: [
          ...PROVIDERS,
          { provide: AZ_TABLE_STORAGE_MODULE_OPTIONS, useValue: options },
          {
            provide: AZ_TABLE_STORAGE_NAME,
            useValue: '',
          },
        ],
        exports: [...EXPORTS, AZ_TABLE_STORAGE_MODULE_OPTIONS],
      };
  }

  static forRootAsync(options: AzTableStorageModuleAsyncOptions): DynamicModule {
      return {
        module: AzTableStorageModule,
        imports: options.imports,
        providers: [
          {
            provide: AZ_TABLE_STORAGE_NAME,
            useValue: '',
          },
          ...PROVIDERS,
          ...this.createAsyncProviders(options),
        ],
        exports: [...EXPORTS],
      };
  }


  private static createAsyncProviders(options: AzTableStorageModuleAsyncOptions): Provider[] {
      if (options.useExisting || options.useFactory) {
          return [this.createAsyncOptionsProvider(options)];
      }
      const useClass = <Type<AzTableStorageOptionsFactory>>options.useClass;
      return [
          this.createAsyncOptionsProvider(options),
          {
          provide: useClass,
          useClass: useClass,
          },
      ];
  }

  private static createAsyncOptionsProvider(
    options: AzTableStorageModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AZ_TABLE_STORAGE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      };
    }

    const inject = [
        (options.useExisting || options.useClass) as Type<AzTableStorageOptionsFactory>
    ]
    return {
      provide: AZ_TABLE_STORAGE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AzTableStorageOptionsFactory) => {
        return await optionsFactory.createAzTableStorageOptions();
      },
      inject: inject,
    };
  }
}