'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

const _ = require('lodash');

const collectVideos = require('./collect-videos');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');
const getBuildDomain = require('../../utils/get-build-domain');

const SITE_URL = getBuildDomain();

const FOUNDER_INTERVIEW_TAG = 'built-to-last';

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
      this._writeVideoComponentFile(video);
    }
  }

  _writeVideoComponentFile(video) {
    let { componentName } = video;
    let data = this._prepareVideoComponentTemplateData(video);
    data = {
      ...data,
      more: this._collectMoreVideos(video).map((video) => this._prepareVideoComponentTemplateData(video)),
      siteUrl: SITE_URL,
    };
    let componentTemplate = this.templates['built-to-last-video'].template(data);

    data = {
      componentName,
    };
    let componentCssBlock = this.templates['built-to-last-video'].stylesheet(data);
    this.writeComponent(componentName, componentTemplate, componentCssBlock);
  }

  _prepareVideoComponentTemplateData(video) {
    let ogImage = video.meta.og ? video.meta.og.image : null;
    assert(ogImage, `Video "${video.meta.title}" is missing an og:image.`);
    assert(
      ogImage.endsWith('/og-image.png'),
      `Video "${video.meta.title}" does have an og:image named "${ogImage}"; the og:image must be named "og-image.png".`,
    );
    assert(
      fs.existsSync(path.join(__dirname, '../../../public', ogImage)),
      `Video "${video.meta.title}" uses an og:image that does not exist: "${ogImage}".`,
    );

    return {
      body: htmlizeMarkdown(video.content),
      videoUrl: video.meta.videoUrl,
      label: video.meta.label,
      title: video.meta.title,
      image: video.meta.image,
      teaser: video.meta.teaser,
      description: video.meta.description,
      og: video.meta.og || {},
      isFounderInterview: video.meta.kind === FOUNDER_INTERVIEW_TAG,
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
