---
layout: workshop
title: SQL Fundamentals
weight: 3
permalink: "/training/2017-11-07-sql-fundamentals"
category: Back End & Full Stack
description: Most web applications rely on storing their data in a relational database,
  consisting of tables which are comprised of columns and rows. PostgreSQL, MySQL
  and SQLite are the most popular and established relational databases, and luckily,
  they have a LOT in common.
image: "/images/training/2017-11-07-sql-fundamentals.png"
stages:
- title: Foundations of Relational Databases
  description: Before we dive into our workshop project, we will spend some time to
    lay the foundation for relational databases and SQL. Learning whether a given
    task is best handled by your database or application layer is a big part of ensuring
    your apps perform well under heavy loads.
  duration: 100
  agenda_items:
  - title: Welcome and Tech Check
    description: We’ll get to know each other and ensure everyone is set up for the
      workshop project.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Relational Algebra and Codd’s Relational Model
    description: In 1970, Edgar Codd invented a new way to model large, organized
      and shared piles of data using the expressive semantics provided by relational
      algebra. Today, virtually all relational databases are still based on these
      fundamental principles. We'll cover the conceptual models behind tables, columns,
      result sets and "joins".
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: Structured Query Language
    description: Virtually all relational databases use some variant of a (mostly)
      declarative programming language called Structured Query Language (SQL) to perform
      operations.  We’ll learn what SQL looks like, and try writing a few statements
      together.
    item_type: lecture
    start_time: '9:45'
    duration: 15
  - title: Three forms of SQL databases
    description: "We’ll focus on a few types of databases, all of which fit our definition
      of “SQL Databases”. \n\n* **Hosted databases** exist as a completely independent
      system component, often running on their own server. PostgreSQL and MySQL are
      among the most popular hosted relational database products today. \n* **Embedded
      databases** are often packaged with an application instance, often as a file
      on disk. From the outside world, it’s hard or impossible to separate “app” from
      “database”. We'll be working extensively with SQLite - a very popular relational
      embedded database widely used in mobile, desktop and web applications.\n* **Spreadsheets**
      can also be regarded as databases. Although more limited than the other types
      of databases, a surprising amount of SQL syntax can be used to perform advanced
      queries and calculations! We'll be using the **google visualization API**, which
      allows us  to “query” a google spreadsheet using a SQL-like syntax and get JSON
      back."
    item_type: lecture
    start_time: '10:00'
    duration: 20
  - title: DB Management Tools
    description: We’ll look at a few tools that will help us on our journey to learn
      more about SQL databases.
    item_type: lecture
    start_time: '10:20'
    duration: 20
- title: Retrieving Data
  description: The first thing we will learn is how to get data out of a database
    in a variety of ways.  We will begin with the simplest possible queries; move
    on to filtering our result set; join tables together to retrieve the data we are
    interested as quickly and easily as possible.
  duration: 210
  agenda_items:
  - title: SELECTing a collection of data
    description: SELECT is the best and easiest way to begin working with a SQL database!
      But as we’ll see later on, it is by far the most complex type of query we’ll
      encounter.
    item_type: lecture
    start_time: '10:40'
    duration: 20
  - title: 'EXERCISE: Selecting Columns'
    description: Selecting all columns in a table is generally inappropriate for a
      production app.  We’ll explicitly pick which columns we need for several collections
      of data that our app needs, and witness the improved performance gained by making
      this simple change.
    item_type: exercise
    start_time: '11:00'
    duration: 30
  - title: Filtering via WHERE clauses
    description: It is often undesirable to work with all tuples or “rows” from a
      given table. Adding a WHERE clause to our SELECT query allows us to specify
      one or more criteria for filtering the result set, down to only what we are
      interested in.
    item_type: lecture
    start_time: '11:30'
    duration: 30
  - title: 'EXERCISE: Filtering via WHERE clauses'
    description: "We’ll add WHERE clauses to the collection queries for two pages
      on our app. \n* On the products list page, we’ll allow the user to filter by
      those products that need to be reordered, those that are discontinued, or the
      full list,\n* On the customer list page, we’ll add a rudimentary search field
      and use a LIKE clause to find matching rows."
    item_type: exercise
    start_time: '12:00'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:30'
    duration: 60
  - title: LIMITing and ORDERing the result set
    description: Particularly when working with large collections of data, it is important
      to be able to sort data the way we want and paginate or scroll through the results.
      We’ll learn how to use LIMIT and OFFSET to retrieve the records of interest,
      and ORDER BY to sort.
    item_type: lecture
    start_time: '13:30'
    duration: 20
  - title: 'EXERCISE: Sorting and Paging'
    description: In our example app, the orders page has over 16,000 records. This
      is way too much data to show to users all at once.  Even looking at an individual
      customer’s orders is a bit overwhelming. We’ll use the existing user interface
      for sorting and pagination, and modify the “orders list”  and “customer orders
      list” queries as appropriate.
    item_type: exercise
    start_time: '13:50'
    duration: 20
- title: Querying Across Tables
  description: Time to put our newfound knowledge of relational algebra into practice!
    One of the great advantages of a relational database is the ability to mix tables
    together in queries, and aggregate or group across columns. Databases are built
    to do this kind of work, so it's often much faster to build the right query than
    to move similar logic into our application code.
  duration: 110
  agenda_items:
  - title: Inner and outer JOINs
    description: 'There are five types of joins in most relational database systems,
      but we can get away with focusing almost entirely on the two categories: INNER
      and OUTER joins. We''ll learn about the distinction between these two types,
      and how to pick the right join operation for the job.'
    item_type: lecture
    start_time: '14:10'
    duration: 30
  - title: 'EXERCISE: JOIN to replace ids with names'
    description: There are several places in our app where alphanumeric IDs are shown
      to users. Humans prefer referring to things by names, so let’s use JOIN to transform
      these references into records that are more user-friendly!
    item_type: exercise
    start_time: '14:40'
    duration: 30
  - title: Aggregate Functions and GROUP BY
    description: 'Often, we are interested in summary data that is aggregated over
      a result set (example: “give me the number of products we have in each category”).
      Through using GROUP BY, we can define the records we are interested in. We can
      use aggregate functions like sum, count, group_concat to aggregate over duplicate
      data.'
    item_type: lecture
    start_time: '15:10'
    duration: 20
  - title: 'EXERCISE: Aggregate Functions and GROUP BY'
    description: There are several places where some additional aggregate information
      is needed in order to “fix” the currently broken experience. Firstly, we need
      to get the subtotal of an order’s line items and display it prominently at the
      bottom of the order page. Then, we'll count and concatenate aggregate results
      as we group records on the employee, customer, and product list pages.
    item_type: exercise
    start_time: '15:30'
    duration: 30
- title: Creating, Updating and Deleting
  description: Now that we have gotten used to the different ways to retrieve data
    from our database, we will learn how to create, manipulate and destroy records.
  duration: 135
  agenda_items:
  - title: Creating and Deleting Records
    description: CREATE and DELETE are considerably simpler than the SELECT statement
      we have been working with so far. More often than not, you’ll be building these
      queries with values entered by users, so this is a great time to discuss SQL
      injection attacks and how we can defend against them.
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: 'EXERCISE: Creating and Updating Orders'
    description: We’ll build the proper queries for creating new orders and updating
      existing ones, being sure to avoid susceptibility to SQL injection attacks.
    item_type: exercise
    start_time: '16:30'
    duration: 30
  - title: Transactions
    description: Transactions allow a sequence of SQL statements to be grouped together
      and treated by the database as one "all or nothing" unit. This important tool
      allows us to achieve an even higher level of data consistency and integrity
      - through the assurance that the entire transaction will either complete, or
      the database will be left totally unaffected.
    item_type: lecture
    start_time: '17:00'
    duration: 30
  - title: 'EXERCISE: Transactions'
    description: We'll use a transaction to update our SQL statement for creating
      a new order.
    item_type: exercise
    start_time: '17:30'
    duration: 30
  - title: Wrap up and review
    description: We'll review everything we have covered so far, and set our sights
      on tomorrow's topics.
    item_type: lecture
    start_time: '18:00'
    duration: 15
- title: The Schema Evolves
  description: Over time, you will often need to update the schema or "shape" of your
    data to meet your application's needs. In this unit, we will learn about using
    migrations to manage these changes. We can apply database-level constraints via
    the schema to ensure that even if our application logic misbehaves, our data is
    always consistent.
  duration: 150
  agenda_items:
  - title: Migrations
    description: 'As a database-driven system evolves, we often need to make changes
      to its schema. We’ll discuss best practices for treating a database as a semi-free-standing
      system component and learn how to commit schema changes to a git repository
      along with our source code, to provide ourselves with a reliable way to maintain
      multiple environments across a team.

'
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: Indices
    description: When we create an index in a database, we are telling it to do some
      bookkeeping as records are added and updated. When the time comes to search
      in a particular way, results can be retrieved quickly and directly using indices.
    item_type: lecture
    start_time: '9:30'
    duration: 30
  - title: 'EXERCISE: Boost JOIN performance via INDEXes'
    description: 'You may have noticed that our database query times increased over
      the last few exercises. One contributor to this problem has to do with the JOINs
      we added in exercise 4. Adding an index will tell the database to keep track
      of particular slices of data at all times, and should dramatically improve these
      JOINed queries

'
    item_type: exercise
    start_time: '10:00'
    duration: 30
  - title: Constraints
    description: To ensure data integrity, sometimes we have the option to put constraints
      directly on a database. For example, if one record refers to another, we can
      require that the other record actually exists. We’ll look at several different
      database-level constraints we can put in place, including NOT NULL, UNIQUE indices
      and foreign keys.
    item_type: lecture
    start_time: '10:30'
    duration: 20
  - title: 'EXERCISE: Adding DB constraints'
    description: 'We’ll add a few constraints to our database to ensure that even
      if our business logic runs into problems, only consistent and valid records
      can be stored.

'
    item_type: exercise
    start_time: '10:50'
    duration: 25
  - title: Wrap up
    description: We'll recap everything we have learned, and provide some resources
      for further learning.
    item_type: lecture
    start_time: '11:15'
    duration: 15
---