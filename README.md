## Description

Azure Database ([Table Storage](http://bit.ly/nest_azure-storage-table), [Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) and more) module for [Nest](https://github.com/nestjs/nest) framework (node.js)

## Tutorial

Learn how to get started with [Azure table storage for NestJS](https://trilon.io/blog/nestjs-nosql-azure-table-storage)

## Before Installation

For Table Storage

1. Create a Storage account and resource ([read more](http://bit.ly/nest_new-azure-storage-account))
1. For [Table Storage](http://bit.ly/nest_azure-storage-table), In the [Azure Portal](https://portal.azure.com), go to **Dashboard > Storage > _your-storage-account_**.
1. Note down the "Storage account name" and "Connection string" obtained at **Access keys** under **Settings** tab. 

## Installation

```bash
$ npm i --save "@ntegral/nestjs-azure-table
```

## Usage

### For Azure Table Storage support

1. Create or update your existing `.env` file with the following content:

```
AZURE_STORAGE_CONNECTION_STRING=
```

2. **IMPORTANT: Make sure to add your `.env` file to your .gitignore! The `.env` file MUST NOT be versioned on Git.**

3. Make sure to include the following call to your main file:

```typescript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
```
