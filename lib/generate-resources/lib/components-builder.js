'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

const _ = require('lodash');

const collectVideos = require('./collect-videos');
const collectWorkshops = require('./collect-workshops');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');
const getBuildDomain = require('../../utils/get-build-domain');

const SITE_URL = getBuildDomain();

const FOUNDER_INTERVIEW_TAG = 'built-to-last';

const BREAK_MARKER = '<!--break-->';

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  constructor(videoContentFolder, workshopContentFolder, templatesFolder, options) {
    super([videoContentFolder, workshopContentFolder, templatesFolder], options);

    this.options = options;
    this.videoContentFolder = videoContentFolder;
    this.workshopContentFolder = workshopContentFolder;
    this.templatesFolder = templatesFolder;
  }

  collectContent() {
    let videos = collectVideos(this.videoContentFolder);
    this.videos = _.chain(videos)
      .filter((video) => video.meta.date <= new Date())
      .sortBy('meta.date')
      .value();
    this.workshops = collectWorkshops(this.workshopContentFolder);
  }

  writeComponentFiles() {
    this._writeLandingPageComponentFile();
    for (let video of this.videos) {
      this._writeVideoComponentFile(video);
    }
    for (let workshop of this.workshops) {
      this._writeWorkshopComponentFile(workshop);
    }
  }

  _writeLandingPageComponentFile() {
    let componentName = 'PageResources';
    let data = {
      componentName,
      ...this._prepareLandingPageComponentTemplateData(),
    };
    let componentTemplate = this.templates['landing-page'].template(data);
    let componentCssBlock = this.templates['landing-page'].stylesheet(data);
    this.writeComponent(componentName, componentTemplate, componentCssBlock);
  }

  _prepareLandingPageComponentTemplateData() {
    let founderVideos = _.chain(this.videos)
      .filter(['meta.kind', FOUNDER_INTERVIEW_TAG])
      .sortBy('meta.date')
      .reverse()
      .value()
      .map((video) => {
        return {
          label: video.meta.label,
          title: video.meta.title,
          image: video.meta.image,
          teaser: video.meta.teaser,
          path: `/resources/video/${video.queryPath}`,
        };
      });

    let workshops = this.workshops.map((workshop) => {
      return {
        leads: workshop.leads.map((lead) => lead.meta.image).join(','),
        label: workshop.meta.label,
        title: workshop.meta.title,
        description: workshop.meta.description,
        tag: workshop.meta.tag,
        path: `/resources/workshop/${workshop.queryPath}`,
      };
    });
    workshops = _.chunk(workshops, workshops.length / 2);

    return {
      founderVideos,
      workshopsLead: workshops[0],
      workshopsTrail: workshops[1],
    };
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

  _writeWorkshopComponentFile(workshop) {
    let { componentName } = workshop;
    let data = this._prepareWorkshopComponentTemplateData(workshop);
    data = {
      ...data,
      siteUrl: SITE_URL,
    };
    let componentTemplate = this.templates.workshop.template(data);

    data = {
      componentName,
    };
    let componentCssBlock = this.templates.workshop.stylesheet(data);
    this.writeComponent(componentName, componentTemplate, componentCssBlock);
  }

  _prepareWorkshopComponentTemplateData(workshop) {
    let breakMarkersInContent = workshop.content.match(new RegExp(BREAK_MARKER, 'g'));
    assert(
      breakMarkersInContent && breakMarkersInContent.length === 3,
      `Workshop "${workshop.meta.title}" is not formatted correctly! It must contain "${BREAK_MARKER}" thrice for separating intro, pre-body, post-body and CTA.`,
    );

    let ogImage = workshop.meta.og ? workshop.meta.og.image : null;
    assert(ogImage, `Video "${workshop.meta.title}" is missing an og:image.`);
    assert(
      ogImage.endsWith('/og-image.png'),
      `Workshop "${workshop.meta.title}" does have an og:image named "${ogImage}"; the og:image must be named "og-image.png".`,
    );
    assert(
      fs.existsSync(path.join(__dirname, '../../../public', ogImage)),
      `Workshop "${workshop.meta.title}" uses an og:image that does not exist: "${ogImage}".`,
    );

    let topics = workshop.topics.map((topic) => {
      return {
        ...topic,
        content: htmlizeMarkdown(topic.content),
      };
    });

    let leads = workshop.leads.map((lead) => {
      return {
        ...lead,
        bio: htmlizeMarkdown(lead.bio),
      };
    });

    let [intro, preBody, postBody, cta] = htmlizeWorkshopContent(workshop.content);
    return {
      intro,
      preBody,
      postBody,
      cta,
      topics,
      leads,
      title: workshop.meta.title,
      description: workshop.meta.description,
      og: workshop.meta.og || {},
      path: `/resources/workshop/${workshop.queryPath}`,
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

function htmlizeWorkshopContent(content) {
  let html = htmlizeMarkdown(content);

  return splitWorkshopContent(html);
}

function splitWorkshopContent(content) {
  return content.split(BREAK_MARKER);
}
