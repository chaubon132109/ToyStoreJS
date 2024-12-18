module.exports = {
  templates: `${__dirname}/.hygen`,
  helpers: {
    ControllerName(name) {
      return `${this.ClassName(name)}Controller`;
    },
    ServiceName(name) {
      return `${this.ClassName(name)}Service`;
    },
    ServiceNameInterface(name) {
      return `${this.ClassName(name)}ServiceInterface`;
    },
    ModuleName(name) {
      return `${this.ClassName(name)}Module`;
    },

    // REPOSITORY START
    RepositoryName(name) {
      return `${this.ClassName(name)}Repository`;
    },
    RepositoryNameInterface(name) {
      return `${this.ClassName(name)}RepositoryInterface`;
    },
    repositoryInterfaceFileName(name) {
      return `${this.fileName(name)}.repository.interface`;
    },
    repositoryFileName(name) {
      return `${this.fileName(name)}.repository`;
    },
    // REPOSITORY END
    EntityName(name) {
      return `${this.ClassName(name)}Entity`;
    },

    entityFileName(name) {
      return `${this.fileName(name)}.entity`;
    },

    schemaName(name) {
      return `${this.ClassName(name)}`;
    },

    SchemaName(name) {
      return `${this.ClassName(name)}`;
    },

    schemaModelName(name) {
      return `${this.ClassName(name)}Schema`;
    },

    RepositoryName(name) {
      return `${this.ClassName(name)}Repository`; // This already returns "UserRepository"
    },
    RepositoryNameInterface(name) {
      return `${this.ClassName(name)}RepositoryInterface`; // This already returns "UserRepositoryInterface"
    },

    schemaFileName(name) {
      return `${this.fileName(name)}.schema`;
    },

    controllerFileName(name) {
      return `${this.fileName(name)}.controller`;
    },
    dtoFileName(name) {
      return `${this.fileName(name)}.dto`;
    },

    // DTO START
    DtoName(name) {
      return `${this.ClassName(name)}`;
    },
    GetListDtoName(name) {
      return `GetList${this.DtoName(name)}RequestDto`;
    },
    GetListResponseDtoName(name) {
      return `GetList${this.DtoName(name)}ResponseDto`;
    },
    GetDetailDtoName(name) {
      return `GetDetail${this.DtoName(name)}RequestDto`;
    },
    GetDetailResponseDtoName(name) {
      return `GetDetail${this.DtoName(name)}ResponseDto`;
    },
    UpdateDtoName(name) {
      return `Update${this.DtoName(name)}RequestDto`;
    },
    CreateDtoName(name) {
      return `Create${this.DtoName(name)}RequestDto`;
    },
    DeleteDtoName(name) {
      return `Delete${this.DtoName(name)}RequestDto`;
    },

    getListDtoFileName(name) {
      return `get-list-${this.fileName(name)}.request.dto`;
    },
    getListResponseDtoFileName(name) {
      return `get-list-${this.fileName(name)}.response.dto`;
    },
    getDetailDtoFileName(name) {
      return `get-detail-${this.fileName(name)}.request.dto`;
    },
    getDetailResponseDtoFileName(name) {
      return `get-detail-${this.fileName(name)}.response.dto`;
    },
    createDtoFileName(name) {
      return `create-${this.fileName(name)}.request.dto`;
    },
    updateDtoFileName(name) {
      return `update-${this.fileName(name)}.request.dto`;
    },
    deleteDtoFileName(name) {
      return `delete-${this.fileName(name)}.request.dto`;
    },
    // DTO END

    serviceInterfaceFileName(name) {
      return `${this.fileName(name)}.service.interface`;
    },
    serviceFileName(name) {
      return `${this.fileName(name)}.service`;
    },
    moduleFileName(name) {
      return `${this.fileName(name)}.module`;
    },
    ClassName(name) {
      return this.changeCase.pascal(name);
    },
    TableName(name) {
      return `${this.inflection.underscore(name)}s`;
    },
    Name(name) {
      const className = this.ClassName(name);
      return `${this.changeCase.camel(name)}`;
    },
    QueryBuilderName(name) {
      const tableName = this.inflection.underscore(name);
      return tableName.split('-').join('');
    },

    moduleName(name) {
      return this.changeCase.camel(name);
    },
    fileName(name) {
      return this.inflection.dasherize(name).toLowerCase();
    },
    modulePath() {
      return 'components';
    },
  },
};
