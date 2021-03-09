'use strict';

const _ = require('lodash');

const collectVideos = require('./collect-videos');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  collectContent() {
    let videos = collectVideos(this.contentFolder);
    this.videos = _.chain(videos)
      .filter((video) => video.meta.date <= new Date())
      .sortBy('meta.date')
      .value();
  }

  writeComponentFiles() {
    for (let video of this.videos) {
      let { componentName } = video;
      let data = this.prepareTemplateData(video);
      data.more = this._collectMoreVideos(video).map((video) => this.prepareTemplateData(video));
      let componentTemplate = this.templates['built-to-last-video'].template(data);

      data = {
        componentName,
      };
      let componentCssBlock = this.templates['built-to-last-video'].stylesheet(data);
      this.writeComponent(componentName, componentTemplate, componentCssBlock);
    }
  }

  prepareTemplateData(video) {
    return {
      body: htmlizeMarkdown(video.content),
      videoUrl: video.meta.videoUrl,
      label: video.meta.label,
      title: video.meta.title,
      image: video.meta.image,
      teaser: video.meta.teaser,
      path: `/resources/video/${video.queryPath}`,
    };
  }

  _collectMoreVideos(video) {
    let otherVideos = _.chain(this.videos)
      .filter(['meta.kind', video.meta.kind])
      .reject(['queryPath', video.queryPath])
      .value();
    let olderVideos = _.chain(otherVideos)
      .filter((otherVideo) => otherVideo.meta.date < video.meta.date)
      .sortBy('video.date')
      .reverse()
      .take(3)
      .value();
    let newerVideos = _.chain(otherVideos)
      .filter((otherVideo) => otherVideo.meta.date > video.meta.date)
      .sortBy('video.date')
      .take(3 - olderVideos.length)
      .value();

    return [...olderVideos, ...newerVideos];
  }
};
