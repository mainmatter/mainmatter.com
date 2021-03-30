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

      let componentName = buildWorkshopComponentName(folderName);
      let queryPath = folderName;

      return {
        componentName,
        queryPath,
        meta,
        content,
        topics,
        leads,
      };
    });
};

function buildWorkshopComponentName(folderName) {
  let cleanedFolderName = folderName
    .replace(/-[a-zA-Z]/g, (match) => match.replace('-', '').toUpperCase())
    .replace(/^[a-zA-Z]/, (match) => match.toUpperCase())
    .replace(/[^a-zA-Z0-9]/, '_');

  return `PageResourcesWorkshop${cleanedFolderName}`;
}
