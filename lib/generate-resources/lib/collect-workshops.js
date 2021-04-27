/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function (folder) {
  return glob
    .sync('*/', {
      cwd: folder,
      absolute: true,
    })
    .map((folder) => {
      let folderName = folder.split(path.sep).pop();
      let description = path.join(folder, 'description.md');
      let [meta, content] = separateMeta(description);
      let topics = glob
        .sync(path.join(folder, 'topics', '*.md'), { abolsute: true })
        .sort()
        .map((topic) => {
          let [meta, content] = separateMeta(topic);
          return { meta, content };
        });
      let leads = glob
        .sync(path.join(folder, 'leads', '*.md'), { abolsute: true })
        .sort()
        .map((lead) => {
          let [meta, bio] = separateMeta(lead);
          return { meta, bio };
        });

      let componentName = buildWorkshopPageComponentName(folderName);
      let cardComponentName = buildWorkshopCardComponentName(folderName);
      let queryPath = folderName;

      return {
        componentName,
        cardComponentName,
        queryPath,
        meta,
        content,
        topics,
        leads,
      };
    });
};

function cleanFolderName(folderName) {
  return folderName
    .replace(/-[a-zA-Z]/g, (match) => match.replace('-', '').toUpperCase())
    .replace(/^[a-zA-Z]/, (match) => match.toUpperCase())
    .replace(/[^a-zA-Z0-9]/, '_');
}

function buildWorkshopPageComponentName(folderName) {
  let cleanedFolderName = cleanFolderName(folderName);

  return `PageResourcesWorkshop${cleanedFolderName}`;
}

function buildWorkshopCardComponentName(folderName) {
  let cleanedFolderName = cleanFolderName(folderName);

  return `WorkshopCard${cleanedFolderName}`;
}
