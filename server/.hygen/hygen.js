const generateDefaultParams = ({ args, h }) => {
  const name = args.name;
  const names = h.inflection.pluralize(args.name);
  const nameClass = h.changeCase.pascalCase(name);
  const nameFile = h.changeCase.snakeCase(name);
  const nameVar = h.changeCase.camelCase(name);

  return {
    names,
    Names: h.capitalize(names),
    nameClass,
    nameFile,
    nameVar,
  };
};

/**
 * @typedef {object} PromptInput
 * @property {string} [message]
 * @property {string} [footer]
 * @property {string} [header]
 * @property {string} [initial]
 * @property {boolean} [required]
 */
/**
 *
 * @param {{prompter, args: object, h}} param0
 * @param {PromptInput} [namePromptInput]
 * @param {{alway_prompt: boolean}} [options] Default true
 * @returns
 */
const promptDefaultParams = async (
  { prompter, args, h },
  { message = '', ...others } = {},
  { alway_prompt = true } = { alway_prompt: true },
) => {
  const params = { ...args };
  if (!params.name || alway_prompt) {
    const { name } = await prompter.prompt({
      type: 'input',
      message: message || args.generator + ' name?',
      ...others,
      name: 'name',
    });
    params.name = name;
  }
  Object.assign(params, generateDefaultParams({ args: params, h }));
  return params;
};

module.exports = {
  generateDefaultParams,
  promptDefaultParams,
};
