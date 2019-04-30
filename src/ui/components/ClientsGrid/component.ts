import Component from '@glimmer/component';

const allClients = [
  {
    id: 'qonto',
    src: '/assets/images/logos/qonto.svg',
    text:
      'Qonto is the leading neobank for SMEs and freelancers in Europe. simplabs works with their web frontend team to boost their productivity, establish Ember.js best practices and ensure long term success.',
  },
  {
    id: 'cardstack',
    src: '/assets/images/logos/cardstack.svg',
    text:
      'Cardstack builds the experience layer for a decentralized internet. simplabs helped them completing their Card UI system and validate its abilities in various prototype projects, identifying and fixing some issues in their core framework along the way.',
  },
  {
    id: 'generali',
    src: '/assets/images/logos/generali.svg',
    text:
      'Generali approached simplabs when they were looking for support with an internal Ember.js project. We guided their team during the course of the project, taught and established best practices until the successful release.',
  },
  {
    id: 'drive',
    src: '/assets/images/logos/hop-skip-drive.svg',
    text:
      'HopSkipDrive builds a safe and dependable transportation solution for schools and families. simplabs built their internal dashboard, allowing them to track rides in real time and react to exceptions immediately.',
  },
  {
    id: 'hood',
    src: '/assets/images/logos/robin-hood.svg',
    text:
      'RobinHood is a charitable foundation fighting poverty in New York City. simplabs helped them establish an effective engineering process as well as build and release a web based tool for managing Civic User Testing Groups.',
  },
  {
    id: 'clark',
    src: '/assets/images/logos/clark.svg',
    text:
      'simplabs was approached by Clark when they were looking for guidance on how to solidify the codebase of their insurance management app. We conducted a thorough review, presented the workshop to the team and layed out a plan for addressing the identified issues.',
  },
  {
    id: 'xbav',
    src: '/assets/images/logos/xbav.svg',
    text:
      'xbAV makes pensions accessible for employees, employers and agents. They approached simplabs when they were looking for support releasing a number of critical features. Our technology experts joined xbAV’s internal team, increasing the available workforce and sharing their expertise.',
  },
  {
    id: 'experteer',
    src: '/assets/images/logos/experteer.svg',
    text:
      'Experteers is Europe’s leading executive career service.simplabs has supported them in various ways ov the years, building custom web apps, reviewing their code as well as providing architecture and process consulting.',
  },
  {
    id: 'mvb',
    src: '/assets/images/logos/mvb.svg',
    text:
      'mvb provides marketing solutions for the german book industry. They approached simplabs when they were looking for external expertise. simplabs performed a workshop, leveling up the team’s expertise and escorted the project until its successful completion.',
  },
  {
    id: 'ringler',
    src: '/assets/images/logos/ringler.svg',
    text:
      'simplabs helped Ringler meet the deadline for one their projects without sacrificing on quality. Our technology experts joined Ringler’s internal team, increasing the available workforce and sharing their expertise.',
  },
  {
    id: 'software',
    src: '/assets/images/logos/neighbourhoodie-software.svg',
    text:
      'simplabs helped Neighbourhoodie successfully complete their first Ember.js project. We conducted an on-site workshop for their team, teaching Ember.js’ fundamental concepts as well as advanced patterns, enabling their team to complete their project successfully.',
  },
  {
    id: 'loconet',
    src: '/assets/images/logos/loconet.svg',
    text:
      'LoCoNET builds online games for the web. They reached out to simplabs to improve their team’s productivity. We identified and fixed some blocking issues, laid the architectural foundation for some advanced features and conducted workshops to level up their team’s expertise.',
  },
  {
    id: 'dim3',
    src: '/assets/images/logos/dim3.svg',
    text:
      'Dim3 delivers software allowing hospitals manage and optimize their patients’ nutrition plans. They approached simplabs when they faced severe performance problems in their app. We identified and fixed these issues and also some others along the way.',
  },

  {
    id: 'trainline',
    src: '/assets/images/logos/trainline.svg',
    text:
      'Trainline is Europe’s leading independent rail and coach platform.We worked with them to deliver a high - performance mobile web app, along with an improved engineering process, enabling Trainline to achieve their business goals for years to come.',
  },
  {
    id: 'timify',
    src: '/assets/images/logos/timify.svg',
    text:
      'When Timify decided it was time to re - engineer their existing product, they trusted us to bring them into the future.We added engineering capacity and technology expertise to Timify’s internal team and helped to build a solid foundation that enabled them to iterate fast and launch on- schedule, without sacrificing quality.',
  },
];

export default class ClientsGrid extends Component {
  get included() {
    return this.args.only ? this.args.only.toLowerCase().split(/\W/) : [];
  }

  get clients() {
    let clients = allClients;
    let included = this.included;
    if (included.length > 0) {
      clients = clients.filter(client => included.includes(client.id));
    }

    return clients;
  }
}
