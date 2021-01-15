import Component from '@glimmer/component';

const allClients = [
  {
    id: 'qonto',
    name: 'Qonto',
    src: '/assets/images/logos/qonto.svg',
    text:
      'Qonto is the leading neobank for SMEs and freelancers in Europe. simplabs works with their web frontend team to boost their productivity, establish Ember.js best practices and ensure long term success.',
  },
  {
    id: 'cardstack',
    name: 'Cardstack',
    src: '/assets/images/logos/cardstack.svg',
    text:
      'Cardstack builds the experience layer for a decentralized internet. simplabs helped them complete their Card UI system and validate its abilities in various prototype projects, identifying and fixing some issues in their core framework along the way.',
  },
  {
    id: 'generali',
    name: 'Generali',
    src: '/assets/images/logos/generali.svg',
    text:
      'Generali approached simplabs when they were looking for support with an internal Ember.js project. We guided their team during the course of the project by teaching and establishing best practices until the project’s successful completion.',
  },
  {
    id: 'hopskipdrive',
    name: 'HopSkipDrive',
    src: '/assets/images/logos/hop-skip-drive.svg',
    text:
      'HopSkipDrive builds a safe and dependable transportation solution for schools and families. simplabs built their internal dashboard, allowing them to track rides in real time and react to exceptions immediately.',
  },
  {
    id: 'robinhood',
    name: 'Robinhood Foundation',
    src: '/assets/images/logos/robin-hood.svg',
    text:
      'RobinHood is a charitable foundation fighting poverty in New York City. simplabs helped them establish an effective engineering process as well as build and release a web based tool for managing Civic User Testing Groups.',
  },
  {
    id: 'clark',
    name: 'Clark',
    src: '/assets/images/logos/clark.svg',
    text:
      'simplabs was approached by Clark when they were looking for guidance on how to solidify the codebase of their insurance management app. We conducted a thorough review, presented the workshop to the team and layed out a plan for addressing the identified issues.',
  },
  {
    id: 'xbav',
    name: 'xbAV',
    src: '/assets/images/logos/xbav.svg',
    text:
      'xbAV makes pensions accessible for employees, employers and agents. They approached simplabs when they were looking for support releasing a number of critical features. Our technology experts joined xbAV’s internal team, increasing the available workforce while boosting their expertise.',
  },
  {
    id: 'experteer',
    name: 'Experteer',
    src: '/assets/images/logos/experteer.svg',
    text:
      'Experteer is Europe’s leading executive career service. simplabs has supported them in various ways over the years, building custom web apps, reviewing their code as well as providing architecture and process consulting.',
  },
  {
    id: 'mvb',
    name: 'mvb',
    src: '/assets/images/logos/mvb.svg',
    text:
      'mvb provides marketing solutions for the german book industry. They approached simplabs when they were looking for external expertise. simplabs performed a workshop, leveling up the team’s expertise and guided the project until its successful completion.',
  },
  {
    id: 'dim3',
    name: 'Dim3',
    src: '/assets/images/logos/dim3.svg',
    text:
      'Dim3 delivers software allowing hospitals to manage and optimize their patients’ nutrition plans. They approached simplabs when they faced severe performance problem in their app. We identified and fixed these issues and also found and solved some potential future problems along the way.',
  },
  {
    id: 'timify',
    name: 'Timify',
    src: '/assets/images/logos/timify.svg',
    text:
      'Timify is an online appointment scheduling service that connects service providers with clients. When they decided it was time to re-engineer their existing product, they trusted us to set them up for future success.',
  },
  {
    id: 'embedd',
    name: 'embeDD',
    src: '/assets/images/logos/embedd.svg',
    text:
      'embeDD is the company behind the popular router firmware DD-WRT. We guided embeDD in laying the foundation for the next version of the firmware\'s UI component so they could rely on it for years to come.',
  },
  {
    id: 'expedition',
    name: 'Expedition',
    src: '/assets/images/logos/expedition.svg',
    text:
      'Expedition is an online travel magazine for global citizens. They turned to simplabs when they were looking for guidance to get the most out of their technology stack based on Elixir, Phoenix and Ember.js.',
  },
  {
    id: 'trainline',
    name: 'Trainline',
    src: '/assets/images/logos/trainline.svg',
    text:
      'Trainline is Europe’s leading independent rail and coach platform. We worked with them to deliver a high - performance mobile web app, along with an improved engineering process, enabling Trainline to achieve their business goals for years to come.',
  },
  {
    id: 'ringler',
    name: 'Ringler',
    src: '/assets/images/logos/ringler.svg',
    text:
      'simplabs helped Ringler meet the deadline for one their projects without sacrificing on quality. Our technology experts joined Ringler’s internal team, increasing the available workforce and sharing their expertise.',
  },
  {
    id: 'neighbourhoodie',
    name: 'Neighbourhoodie Software',
    src: '/assets/images/logos/neighbourhoodie-software.svg',
    text:
      'simplabs helped Neighbourhoodie successfully complete their first Ember.js project. We conducted an on-site workshop for their team, teaching Ember.js’ fundamental concepts as well as advanced patterns, enabling their team to complete their project successfully.',
  },
  {
    id: 'loconet',
    name: 'LoCoNET',
    src: '/assets/images/logos/loconet.svg',
    text:
      'LoCoNET builds online games for the web. They reached out to simplabs to improve their team’s productivity. We identified and fixed some blocking issues, laid the architectural foundation for some advanced features and conducted workshops to level up their team’s expertise.',
  },
  {
    id: 'erdil',
    name: 'ERDiL',
    src: '/assets/images/logos/erdil.svg',
    text:
      'ERDiL builds natural language processing software that helps companies analyze messages from their customers. They reached out to simplabs for guidance on writing tests for their Ember.js based dashboard app and establishing a sustainable testing culture.',
  },
  {
    id: 'medify',
    name: 'Medify',
    src: '/assets/images/logos/medify.svg',
    text:
      'Medify offers high-quality medical admissions help and was used by 2 in 3 of 2020\'s UCAT applicants in the UK. simplabs supported their team with identifying issues in their Ember.js apps, architectural advice as well as releasing a business-critical project on schedule.',
  },
  {
    id: 'poellath',
    name: 'POELLATH',
    src: '/assets/images/logos/poellath.png',
    text:
      'POELLATH is a German law firm specializing in advice on transactions and asset management. When they were looking to build custom software tools to improve workflows, we conducted a product strategy workshop with them to develop a clear understanding of these tools and enable next steps.',
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
      clients = included.map(i => clients.find(client => client.id === i));
    }

    return clients;
  }
}
