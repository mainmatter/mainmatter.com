---
layout: workshop
title: Web Security
weight: 3
permalink: "/services/training/2017-06-11-web-security"
redirect_from: "/training/2017-06-11-web-security"
category: Security
description: Security is an increasingly important part of building modern web applications,
  but developers often fall victim to the pressure of tight deadlines. In this course,
  we'll get hands on both from the attacking and defending standpoint, and learn how
  to keep the baddies out.
image: "/images/training/2017-06-11-web-security.png"
stages:
- title: State of Web App Security
  description: Before we jump in, let's talk about the current state of Web Application
    security in comparison to the ops and infrastructure security world. We'll also
    look at the typical categories of attacks, and what we can do as developers to
    make sure we're not easy targets ourselves!
  duration: 90
  agenda_items:
  - title: Welome
    description: We’ll make sure everyone is set up for the workshop, and go over
      the day’s agenda.
    item_type: lecture
    start_time: '9:00'
    duration: 10
  - title: State of Web App Security
    description: We’ll look at the role web security plays in the world, dissect the
      methodology behind some recent high-profile attacks, and discuss some shocking
      statistics regarding the vulnerability of web applications worldwide.
    item_type: lecture
    start_time: '9:10'
    duration: 20
  - title: Categories of Attacks
    description: We’ll look at a modern web application system as a whole, and point
      out several places where an attacker can probe, interfere with, or otherwise
      compromise it.
    item_type: lecture
    start_time: '9:30'
    duration: 15
  - title: Protecting Developer Secrets
    description: Developers are part of the system and can be targeted easily. We’ll
      go through the exercise of putting a password in front of a SSH key, encrypting
      a text file, and effectively managing file permissions on a POSIX-compliant
      operating system.
    item_type: lecture
    start_time: '9:45'
    duration: 15
  - title: 'EXERCISE: Developer Lockdown'
    description: Using our newfound knowledge of developer security best practices,
      it is time to lock down your own machine.
    item_type: exercise
    start_time: '10:00'
    duration: 15
  - title: Break
    description: Coffee Break
    item_type: break
    start_time: '10:15'
    duration: 15
- title: Client-Side Vulnerabilities
  description: The ability for users to inject content into web pages is the root
    cause of a broad class of vulnerabilities, which can affect the experience of
    other users, and leak potentially useful information out to an attacker. We’ll
    conduct some attacks in a controlled environment, and then learn how to defend
    against them in our own web applications.
  duration: 225
  agenda_items:
  - title: Cross-Site Scripting (XSS)
    description: Cross-Site Scripting (XSS) typically originates from failing to sufficiently
      sanitize user-generated content. We’ll look at how several types of seemingly
      benign user input can be used to inject some troublesome code into a web application.
    item_type: lecture
    start_time: '10:30'
    duration: 20
  - title: 'ATTACK: Cross-Site Scripting'
    description: Find a way to use a cross-site scripting attack to inject a malicious
      script into the example web application, such that the user’s username and password
      are sent to a RequestBin when they attempt to login. The operation of the application
      should not be obviously affected.
    item_type: exercise
    start_time: '10:50'
    duration: 20
  - title: 'DEFEND: Cross-Site Scripting'
    description: Use some content sanitization techniques to ensure that raw user-generated
      content isn’t used dangerously. This should result in your previous XSS attack
      being "disarmed".
    item_type: exercise
    start_time: '11:10'
    duration: 20
  - title: Cross-Site Request Forgery Attacks (CSRF)
    description: Cross-Site Request Forgery Attacks (CSRF) attacks force users to
      take unwanted actions in an application to which they're currently authenticated.
      We'll look at how this attack works, and what we can do to mitigate against
      it.
    item_type: lecture
    start_time: '11:30'
    duration: 20
  - title: 'ATTACK: CSRF'
    description: Stage a CSRF attack against the online banking example app to get
      users who click a particular link to transfer funds from their account to another
      one.
    item_type: exercise
    start_time: '11:50'
    duration: 20
  - title: 'DEFEND: CSRF'
    description: Use a CSRF token to defend against request forgery attacks. Your
      attack in the previous exercise should no longer work.
    item_type: exercise
    start_time: '12:10'
    duration: 20
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:30'
    duration: 45
  - title: Clickjacking Attacks
    description: Clickjacking involves carefully placing a transparent frame in a
      way that tricks the user into clicking a legitimate button, ultimately resulting
      in users performing an unintentional action in another web application.
    item_type: lecture
    start_time: '13:15'
    duration: 20
  - title: 'ATTACK: Clickjacking'
    description: Stage a clickjacking attack using the example web application, by
      positioning a transparent frame of the "Blue" web application over the "Red"
      web application.
    item_type: exercise
    start_time: '13:35'
    duration: 20
  - title: 'DEFEND: Clickjacking'
    description: Use the `X-Frame-Options` headers on the HTTP response for the "Blue"
      web application. This should disarm your previous Clickjacking attack.
    item_type: exercise
    start_time: '13:55'
    duration: 20
- title: Server-Side Vulnerabilities
  description: Attacks that cause a hosted application to operate in unexpected or
    unpredictable ways, can result in private data either leaking out through HTTP
    responses or logs.
  duration: 115
  agenda_items:
  - title: SQL Injection
    description: SQL injection attacks take advantage of improper sanitization of
      user input, to execute unplanned SQL statements against a database. This can
      result in leaking of private information, or potentially, total destruction
      of the database.
    item_type: lecture
    start_time: '14:15'
    duration: 20
  - title: 'ATTACK: SQL Injection'
    description: Identify and exploit a SQL injection vulnerability in the online
      banking example app.
    item_type: exercise
    start_time: '14:35'
    duration: 20
  - title: 'DEFEND: SQL Injection'
    description: Alter the online banking app so that user input is sanitized. Now,
      your SQL injection attack should no longer cause private data to be disclosed.
    item_type: exercise
    start_time: '14:55'
    duration: 20
  - title: Break
    description: Coffee Break
    item_type: break
    start_time: '15:15'
    duration: 15
  - title: Timing Attacks
    description: Timing attacks, aim to get information out of a secure system by
      analyzing the time taken to perform certain operations -- usually the time that's
      related to the implementation of an encryption algorithm or other security measures.
    item_type: lecture
    start_time: '15:30'
    duration: 10
  - title: 'ATTACK: Timing'
    description: Use a database of potential users, analyze login attempts to determine
      the users for which the password is actually evaluated, vs the users where the
      system doesn't bother checking at all (i.e., non-user or disabled user).
    item_type: exercise
    start_time: '15:40'
    duration: 20
  - title: 'DEFEND: Timing'
    description: Use a "dummy evaluation" to mitigate against a timing attack. Your
      solution to the previous exercise should have inconclusive results now.
    item_type: exercise
    start_time: '16:00'
    duration: 10
- title: Network & Infrastructure Vulnerabilities
  description: Even if you lock down your client and server side, it's still our responsibility
    as developers to prevent users from getting into trouble when networks and certificates
    are tampered with.
  duration: 65
  agenda_items:
  - title: Man-in-the-middle attacks, HTTPS and HSTS
    description: 'There''s a good reason that the entire internet is moving toward
      HTTPS: it is exceedingly easy to observe and tamper with plain HTTP traffic.
      However, HTTPS is not enough! We''ll look at HTTP Strict Transport Security
      headers, and how we can save users from themselves.'
    item_type: lecture
    start_time: '16:10'
    duration: 30
  - title: Subresource Integrity (SRI)
    description: 'What would happen if someone tampered with your CDN? Subresource
      Integrity (SRI) protects us from problems caused by tampered CDN, even when
      everything else fails. We''ll look at how an attack could be staged, and how
      SRI would save our users.

'
    item_type: lecture
    start_time: '16:40'
    duration: 20
  - title: Wrap up and Recap
    description: We'll recap everything we've covered, and provide references for
      further reading and learning.
    item_type: lecture
    start_time: '17:00'
    duration: 15
---