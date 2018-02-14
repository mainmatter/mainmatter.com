---
layout: workshop
title: Professional SQL
weight: 3
permalink: "/training/2017-12-03-professional-sql"
category: Back End & Full Stack
description: Most developers stick to performing the basic CRUD operations on their
  database, but modern projects like SQLite, PostgreSQL and MySQL can do *so* much
  more. In this course, we'll discuss a wide range of features that can serve to keep
  data layer speedy, scalable and consistent.
image: "/images/training/2017-12-03-professional-sql.png"
stages:
- title: 'Programming your database '
  description: There are often advantages to setting up a database so that common
    tasks can be performed easily and by name. This way, we can more simply refer
    to these operations in our application logic, and rely on always getting the consistently
    correct behavior.
  duration: 290
  agenda_items:
  - title: Welcome and Tech Check
    description: We’ll get to know each other and ensure everyone is set up for the
      workshop project.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Views
    description: 'Views are just queries stored in our database. We can use them in
      queries by name, as if they’re another table.

'
    item_type: lecture
    start_time: '9:15'
    duration: 20
  - title: 'EXERCISE: Views for Dashboard Stats'
    description: We’ll build a few queries for a “dashboard”, showing high-level statistics
      from our database. As we may have several applications that should retrieve
      the same result set, we’ll need to set our queries up as views - this may get
      a bit complicated.
    item_type: exercise
    start_time: '9:35'
    duration: 25
  - title: Prepared Statements
    description: 'Prepared statements allow us to create, parse and plan a parameterized
      database query. We''ll pass values into a statement object later to evaluate
      it, just like a regular query. Depending on which database solution you are
      working with, prepared statements may be stored in the database itself (and
      shared across all clients), or created as an object in your application code. '
    item_type: lecture
    start_time: '10:00'
    duration: 20
  - title: 'EXERCISE: Prepared Statements'
    description: As the database connection is initially set up, build some prepared
      statements to power the “customer stats” feature.
    item_type: exercise
    start_time: '10:20'
    duration: 20
  - title: Triggers & Procedural SQL
    description: Triggers are pieces of procedural code that are automatically executed
      at a particular moment in time. There are many uses for triggers, and for the
      most part, this is a feature which works across SQLite, PostgreSQL and MySQL.
    item_type: lecture
    start_time: '10:40'
    duration: 40
  - title: 'EXERCISE: Order Totals'
    description: Currently, it would be prohibitively expensive (in terms of CPU)
      to add an “Order Total” column onto the `/orders/` page, due to the cost of
      *aggregate function* on a HUGE table (`Order x OrderDetail`). We can use another
      approach involving new `OrderTotal` column and a trigger. Whenever an OrderDetail
      row changes, update the `OrderTotal` value for the appropriate order.
    item_type: exercise
    start_time: '11:20'
    duration: 30
  - title: Materialized Views
    description: Materialized views can be used just like regular views. The key difference
      is that they exist as “refreshable” but nonetheless persisted tables in the
      database. To put it another way, materialized views need to be recalculated
      periodically, but certainly not on a per-query basis.
    item_type: lecture
    start_time: '11:50'
    duration: 30
  - title: 'EXERCISE: Better Dashboard Stats'
    description: A dashboard is a great potential use case for materialized views,
      as it displays stats that are not changing from minute-to-minute. We can probably
      get away with running a few really intense queries once per hour, per day, etc…
      Once the work is done, the result set can be queried just as speedily as any
      other table.
    item_type: exercise
    start_time: '12:20'
    duration: 30
  - title: Lunch
    description: Break for lunch.
    item_type: break
    start_time: '12:50'
    duration: 60
- title: 'Relational DB: The Next-Generation'
  description: |-
    Over the last decade, there has been a lot of excitement around databases that are decidedly NOT relational. We have seen a rise in popularity around Key-Value stores like Memcached and Redis due to their pubsub system, and a movement toward “NoSQL” databases that offer greater flexibility for storing objects of widely-varying shapes.

    The great news is that hosted relational databases have caught up! Starting with PostgreSQL 9.4 and MySQL 5.7 support JSON as a column type, first-class pubs systems, full-text search and more!
  duration: 180
  agenda_items:
  - title: Structured Data Types
    description: Starting with PostgreSQL 9.4 and MySQL 5.7, we can create JSON and
      array columns. The main benefit of storing these values as structured data (as
      opposed to “stringifying” them) is that we can query INTO the values via more
      sophisticated mechanisms than “does this string match”.
    item_type: lecture
    start_time: '13:50'
    duration: 30
  - title: 'EXERCISE: Tagged Products'
    description: Create a new database migration to add a `tags` array column to the
      `Product` table. This should allow us to do some non-hierarchical categorization
      on the product list (i.e., “Sauces”, “Bakery”, “Beverages”).
    item_type: exercise
    start_time: '14:20'
    duration: 30
  - title: 'EXERCISE: Customer Preferences'
    description: Create a new database migration to add a `preferences` column for
      json values to the `Customer` table. Present the information on the customer’s
      page.
    item_type: exercise
    start_time: '14:50'
    duration: 30
  - title: Pub/Sub
    description: 'A publish-subscribe (pubsub) system is a software architecture pattern
      where publishers push messages into “channels”, and subscribers who have an
      interest in particular channels receive them. Publishers and subscribers have
      no direct knowledge of each other. '
    item_type: lecture
    start_time: '15:20'
    duration: 20
  - title: 'EXERCISE: Auto-Refreshing Dashboard'
    description: Whenever a new order is created, use the existing web socket mechanism
      with `LISTEN` and `NOTIFY` calls to trigger a page refresh (if users are viewing
      the dashboard).
    item_type: exercise
    start_time: '15:40'
    duration: 20
  - title: Full Text Search
    description: |-
      When implementing a search-engine-like feature on a web application, typically the results must very closely match the search term. In the past, this limitation was countered by adding new system components like Apache [Solr](http://lucene.apache.org/solr/) and [Lucene](https://lucene.apache.org/core/). Setting these up is a daunting task, to say the least, and is absolutely overkill for many use cases.

      Thankfully, modern versions of PostgreSQL and MySQL feature simplified versions of this technology. We can perform a search against multiple fields, specifying how much “weight” should be given to each field.
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: 'EXERCISE: Global Search'
    description: There’s currently a “global search” feature on our workshop app,
      which uses an overly simplistic and narrow mechanism to find relevant results.
      Upgrade this feature using our database’s full text search feature set.
    item_type: exercise
    start_time: '16:30'
    duration: 20
- title: Hosted DB Administration
  description: "Most developers put off learning how to properly manage a production
    database service until a major problem occurs. We will save you this pain, and
    teach you ahead of time how to:\n* Create and restore from backups (including
    **restoring to a specific point-in-time!**) \n* Clone your production data, for
    use in a staging or development environment\n* Monitor CPU usage, and identify
    excessively costly queries"
  duration: 70
  agenda_items:
  - title: Command line and backup
    description: While the GUI tools we have been using are most developers’ first
      choice when it comes to DB tools, when working with production systems you’ll
      often end up using SSH in a machine that’s not accessible from the outside world.
      We’ll learn a couple of common tasks relating to database setup, analysis and
      maintenance — all of which can be done from a POSIX-compliant command line.
    item_type: lecture
    start_time: '16:50'
    duration: 30
  - title: Performance and optimization
    description: "Particularly if you are using a high-performance backend language
      that allows a very high degree of concurrency, your database may end up becoming
      your #1 performance bottleneck. We’ll look at: \n* a couple of “first pass”
      optimizations you can perform on your production database,\n* an auditing tool
      you can use to keep track of costly queries,\n* setting up a read-only replica
      that you can hit hard without disrupting your primary database server."
    item_type: lecture
    start_time: '17:20'
    duration: 30
  - title: Wrap Up
    description: We'll recap everything we've learned today, and talk about resources
      for continued education.
    item_type: lecture
    start_time: '17:50'
    duration: 10
---