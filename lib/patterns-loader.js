const config = require('./config');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars')

const patternBasePaths = Object.keys(config.patterns).map((key) => {
  return config.patterns[key].path
});

const getPattern = (folder, templateFile) => {
  let pattern = null;
  patternBasePaths.forEach((patternBasePath) => {
    const templateFilePath = path.join(
      config.basePath,
      patternBasePath,
      '/',
      folder,
      '/',
      templateFile
    );

    const schemaFilePath = path.join(
      config.basePath,
      patternBasePath,
      '/',
      folder,
      '/',
      'schema.json'
    );

    if (fs.existsSync(templateFilePath)) {
      pattern = {
        templateFilePath,
        schemaFilePath
      }
    }
  });

  return pattern;
};

const getContext = (pattern) => {
  const type = typeof pattern.hash.data

  if (pattern.fn && typeof (pattern.fn) === 'function') {
    pattern.hash.data.children = pattern.fn(pattern.data.root)
    return pattern.hash.data
  }

  switch (type) {
    case 'undefined':
      return pattern.data.root;
    case 'object':
      return pattern.hash.data;
    case 'string':
      return pattern.data.root[pattern.hash.data] || pattern.data.root[pattern.hash.name];
    default:
      throw new Error(`Unknown type of data: ${type}`);
  }
}

const helperHandlebars = () => {
  Handlebars.registerHelper('pattern', (ptrn) => {
    const name = ptrn.hash.name;
    const folder = name;
    const file = `${name}.hbs`;
    const context = getContext(ptrn);
    const patternTemplate = getPattern(folder, file);

    if (!patternTemplate) throw new Error(`no template for ${name}`);

    const templateFileContent = fs.readFileSync(patternTemplate.templateFilePath, 'utf8');
    const templateHbs = Handlebars.compile(templateFileContent);
    const html = templateHbs(context);

    return new Handlebars.SafeString(html);
  })
};

const pattern = (name, data) => {
  helperHandlebars();
  const file = `${name}.hbs`;
  const patternTemplate = getPattern(name, file);

  if (!data) throw new Error(`no Data for ${name}`);
  if (!patternTemplate) throw new Error(`no template for ${name}`);

  const templateFileContent = fs.readFileSync(patternTemplate.templateFilePath, 'utf8');
  const templateHbs = Handlebars.compile(templateFileContent);
  const html = templateHbs(data);
  return new Handlebars.SafeString(html);
}

module.exports = pattern;

