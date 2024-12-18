'use strict';

module.exports = {
  prompt: ({ prompter, args }) => {
    return prompter
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Name:',
          validate(value) {
            if (!value.length) {
              return 'Module must have a name.';
            }
            return true;
          },
        },
        {
          type: 'MultiSelect',
          name: 'blocks',
          message: 'Blocks:',
          initial: [
            'Module',
            'Controller',
            'Service',
            'ServiceInterface',
            'Repository',
            'RepositoryInterface',
            'CreateDto',
            'UpdateDto',
            'DeleteDto',
            'GetListDto',
            'GetDetailDto',
            'GetListResponseDto',
            'GetDetailResponseDto',
            'Schema',
          ],
          choices: [
            {
              name: 'Module',
              value: 'Module',
            },
            {
              name: 'Controller',
              value: 'controller',
            },
            {
              name: 'Service',
              value: 'service',
            },
            {
              name: 'ServiceInterface',
              value: 'serviceInterface',
            },
            {
              name: 'Repository',
              value: 'repository',
            },
            {
              name: 'RepositoryInterface',
              value: 'repositoryInterface',
            },
            {
              name: 'CreateDto',
              value: 'create-dto',
            },
            {
              name: 'UpdateDto',
              value: 'update-dto',
            },
            {
              name: 'GetListDto',
              value: 'get-list-dto',
            },
            {
              name: 'GetDetailDto',
              value: 'get-detail-dto',
            },
            {
              name: 'DeleteDto',
              value: 'delete-dto',
            },
            {
              name: 'GetListResponseDto',
              value: 'get-list-response-dto',
            },
            {
              name: 'GetDetailResponseDto',
              value: 'get-detail-response-dto',
            },
            {
              name: 'Schema',
              value: 'schema',
            },
          ],
        },
      ])
      .then((answer) => {
        console.log('[GEN][SUCCESS]', answer);
        return answer;
      })
      .catch((error) => {
        console.error('[GEN][ERROR]', error);
      });
  },
};
