---
layout: case-study
company: Aleph Alpha
title: A large-scale data pipeline to feed AI models | Work
description:
  <p>Aleph Alpha empowers businesses and governments with the most advanced
  generative AI technology, to gain a decisive edge in the thriving AI
  economy.</p><p>Training AI models requires preprocessing large amounts of data.
  When Aleph Alpha set out to leverage Rust to prepare the training dataset for their new model, 
  they reached out to Mainmatter for support in architecting and implementing a scalable 
  and efficient data pipeline.</p>
permalink: false
---

## About Aleph Alpha

Aleph Alpha is a German AI startup, a leader in the field of explainable and trustworthy sovereign AI.  
They're one of the few major players in the AI space based (and funded) entirely in Europe.

## The challenge

Aleph Alpha wanted to train the next generation of their AI foundational models.  
The name of the game in the world of AI is data: You want to train using a **large high-quality dataset** to 
get the best results.

Processing a lot of data is a challenge in itself. When you are dealing with **petabytes** of text, 
you can't just spin up a single large server to process it all. That would take **forever** and **forever** 
is not an option when you're working in the AI space. You have to **iterate quickly** to improve your models 
and ensure that you as well as your customers are always building with the latest and greatest.   
Aleph Alpha had booked a GPU cluster to train their models a few months in advance. The 
dataset had to be processed and ready to go by the time cluster was available. The clock was ticking!  
The plan: Build a **distributed data pipeline in Rust** in order to process the data in a reasonable amount of time.

But, as all startups, Aleph Alpha has to deal with **limited resources**.  
Their engineering team must ensure that the existing product platform is running smoothly: They won't neglect 
their existing customers for the sake of a new project!  
That's where we at Mainmatter come into the picture.

## Mainmatter's role

We partnered with Aleph Alpha in September 2023 to help them design and implement the data pipeline they needed. 
We followed a **team augmentation** approach. Our Principal Engineering Consultant, Luca Palmieri, embedded into 
Aleph Alpha's team for three months to ensure they could deliver the project.  

We took responsibility in four key areas: architecture, infrastructure, Rust and mentoring.

### Architecture

You need to **distribute the workload** across multiple machines to run such a large-scale pipeline to completion in a 
reasonable amount of time. That's how you fully leverage the capabilities of modern 
cloud computing: Going from zero to **thousands of CPUs** for a few hours, then back to zero.  

The system as a whole must also satisfy a variety of other constraints:
- **Fault-tolerance**: If a machine fails, the pipeline should be able to recover and continue processing
  from where it left off, without losing any data.
- **Cost-efficiency**: Storage fees, egress fees, compute fees... all of these can add up quickly.  
  The system must be designed with cost-efficiency in mind from the get-go.
- **Data lineage**: It should be possible to trace every piece of output data back to its source. This is
  critical for debugging and auditing purposes.

We worked closely with Aleph Alpha's team to design a system that would satisfy all of these constraints, while 
being **simple to operate** and **easy to reason about**.  

### Infrastructure

You can't architect a system in a vacuum: you need to take into account the **infrastructure** it will run on.  
The underlying provider determines the capabilities you have at your disposal and the constraints you must work around—e.g.
the maximum download/upload throughput you can expect from a single data bucket, the cost of moving a GB of data
from one region to another, etc.

You can't architect a system in a vacuum: You need to take into the **infrastructure** it will run on. 
The underlying provider determines the capabilities and constraints you have to work with, such as the maximum 
download / upload throughput you can expect from a single data bucket or the cost of moving a GB of data 
from one cloud region to another, etc.

We worked with Aleph Alpha's team to assess a few different cloud providers and pick the one that would best fit the
needs of the system as well as the company's long-term strategy: [StackIt](https://stackit.de/), a German cloud provider.

We chose to rely on managed versions of Open Source software. We were able to transfer knowledge built over years 
of experience with these tools to Aleph Alpha's team, while still benefiting from the ease of use of a managed service. 
At the same time, it reduced the overall infrastructure risk for the project. If we were to run into an unsolvable 
issue with StackIt's managed offering, we could always fall back to the Open Source version or switch to another 
provider.

The final infrastructure stack looked like this:
- **Object storage**: We used StackIt's managed object storage to store the input and output data for the pipeline.
  The interface was compatible with the S3 API, which allowed us to rely on AWS' battle-tested Rust SDK.
- **Message broker**: We picked RabbitMQ to pass messages between the different components
  of the pipeline. [`lapin`](https://crates.io/crates/lapin) served well as a Rust client.
- **Metadata storage**: We used PostgreSQL to store metadata about the pipeline's progress. We relied on
  [`sqlx`](https://crates.io/crates/sqlx) to interact with the database from Rust.
- **Compute**: We relied on StackIt's managed Kubernetes offering to run the pipeline.

### Rust

The entire data pipeline was built in Rust. That's the reason Aleph Alpha reached out to Mainmatter in the first place:
They needed someone with deep expertise in Rust to help them deliver the project.  

Rust is a great fit for this kind of project as it delivers high and predictable performance, while giving you
precise control over the memory layout of your data. That efficiency is critical when dealing with
such a large dataset and you want to make sure you are not wasting CPU cycles or RAM.  
But the Aleph Alpha team already knows all this: They've been using Rust to power their core product offering for years.

Throughout the project we came to appreciate a few more advantages of using Rust:

- **Correctness**: Rust's type system and borrow checker make it easy to write code that is correct by construction.  
  That's even _more_ important on a project with such an aggressive timeline: you don't want to waste time debugging
  runtime errors or memory unsafety bugs. The more static analysis the compiler can do for you, the more confident
  you can be that your code is correct.
- **Interoperability**: Python is king when it comes to the size of its AI ecosystem. Aleph Alpha's AI researchers
  were working very closely with us on the project: tuning parameters, testing filters, checking data quality, etc. 
  Using Rust's excellent Python interop capabilities, we empowered them to prototype in Python (the language they
  were familiar with): we would then plug the Python code into the Rust pipeline (thanks [`pyo3`](https://crates.io/crates/pyo3)!) 
  to verify it and run it at scale. If the change was desirable, and we needed better performance, we would then
  port the Python code over to Rust.

### Mentoring

We split our time between delivery and mentoring.  
Mainmatter's Principal Engineering Consultant, Luca Palmieri, spent several hours a week pairing with Aleph Alpha's
team: we worked on the project together, discussing design decisions, reviewing code, and sharing knowledge.  

Aleph Alpha's team is experienced and highly talented. Nonetheless, the entire project was on an extremely
tight schedule: having someone with the deep expertise on the team allowed them to **move faster** and **avoid costly
mistakes**.

## Outcome

The project was a success: we assembled a high-quality multilingual dataset with over **X trillion tokens**.  
We also managed to design, develop and run the data pipeline on time and on budget: Aleph Alpha didn't have to delay 
their training schedule by a single day. The data was ready to go by the time the GPU cluster was available.  

We look forward to working together again in the future!