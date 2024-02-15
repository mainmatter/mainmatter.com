---
layout: case-study
company: Aleph Alpha
problem:
  Aleph Alpha wanted to take advantage of Rust’s built-in efficiency for their
  latest learning model.
solution: We provided the know-how to build the infrastructure.
tags: Team Reinforcement
title: Preprocessing trillions of tokens with Rust | Work
displayTitle: "Preprocessing trillions of tokens with Rust"
description:
  <p>Aleph Alpha empowers businesses and governments with the most advanced
  generative AI technology, to gain a decisive edge in the thriving AI
  economy.</p><p>Training AI models requires preprocessing large amounts of
  data. When Aleph Alpha set out to leverage Rust to prepare the training
  dataset for their new model, they reached out to Mainmatter for support in
  architecting and implementing a scalable and efficient data pipeline.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/aleph-alpha-background-2.jpg"
  imageAlt: "Router on a white background"
  tags: "development / architecture"
og:
  image: /assets/images/cases/cs-aleph-alpha-og-image.jpg
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %}
{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About Aleph Alpha</h3>
  <div class="case-study__text">
      <p>Aleph Alpha is a German AI startup, a leader in the field of explainable and trustworthy sovereign AI. 
      They're one of the few major players in the AI space based (and funded) entirely in Europe.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The challenge</h3>
    <div class="case-study__text">
        <p>Aleph Alpha wanted to train the next generation of their AI foundational models.<br>
        The name of the game in the world of AI is data: You want to train using a <strong>large high-quality dataset</strong> to 
        get the best results.</p>
        <p>Processing a lot of data is a challenge in itself. When you are dealing with <strong>petabytes</strong> of text, 
        you can't just spin up a single large server to process it all. That would take <strong>forever</strong> and <strong>forever</strong> 
        is not an option when you're working in the AI space. You have to <strong>iterate quickly</strong> to improve your models 
        and ensure that you as well as your customers are always building with the latest and greatest.<br>
        Aleph Alpha had booked a GPU cluster to train their models a few months in advance. The 
        dataset had to be processed and ready to go by the time cluster was available. The clock was ticking!<br>
        The plan: Build a <strong>distributed data pipeline in Rust</strong> in order to process the data in a reasonable amount of time.</p>
        <p>But, as all startups, Aleph Alpha has to deal with <strong>limited resources</strong>.<br>
        Their engineering team must ensure that the existing product platform is running smoothly: They won't neglect 
        their existing customers for the sake of a new project!<br>
        That's where we at Mainmatter come into the picture.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Mainmatter's role</h3>
    <div class="case-study__text">
        <p>We partnered with Aleph Alpha in September 2023 to help them design and implement the data pipeline they needed. 
        We followed a <strong>team augmentation</strong> approach. Our Principal Engineering Consultant, Luca Palmieri, embedded into 
        Aleph Alpha's team for three months to ensure they could deliver the project.</p>
        <p>We took responsibility in four key areas: architecture, infrastructure, Rust and mentoring.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Architecture</h3>
    <div class="case-study__text">
        <p>You need to <strong>distribute the workload</strong> across multiple machines to run such a large-scale pipeline to completion in a 
        reasonable amount of time. That's how you fully leverage the capabilities of modern 
        cloud computing: Going from zero to <strong>thousands of CPUs</strong> for a few hours, then back to zero.</p>
        <p>The system as a whole must also satisfy a variety of other constraints:</p>
        <ul>
            <li><strong>Fault-tolerance</strong>: If a machine fails, the pipeline should be able to recover and continue processing
            from where it left off, without losing any data.</li>
            <li><strong>Cost-efficiency</strong>: Storage fees, egress fees, compute fees... all of these can add up quickly.  
            The system must be designed with cost-efficiency in mind from the get-go.</li>
            <li><strong>Data lineage</strong>: It should be possible to trace every piece of output data back to its source. This is
            critical for debugging and auditing purposes.</li>
        </ul>
        <p>We worked closely with Aleph Alpha's team to design a system that would satisfy all of these constraints, while 
        being <strong>simple to operate</strong> and <strong>easy to reason about</strong>.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Infrastructure</h3>
    <div class="case-study__text">
      <p>You can't architect a system in a vacuum: You need to take into the <strong>infrastructure</strong> it will run on. 
        The underlying provider determines the capabilities and constraints you have to work with, such as the maximum 
        download / upload throughput you can expect from a single data bucket or the cost of moving a GB of data 
        from one cloud region to another, etc.</p>
        <p>We worked with Aleph Alpha's team to assess a few different cloud providers and pick the one that would best fit the
        needs of the system as well as the company's long-term strategy: <a href="https://stackit.de/">StackIt</a>, a German cloud provider.</p>
        <p>We chose to rely on managed versions of Open Source software. We were able to transfer knowledge built over years 
        of experience with these tools to Aleph Alpha's team, while still benefiting from the ease of use of a managed service. 
        At the same time, it reduced the overall infrastructure risk for the project. If we were to run into an unsolvable 
        issue with StackIt's managed offering, we could always fall back to the Open Source version or switch to another 
        provider.</p>
        <p>The final infrastructure stack looked like this:</p>
        <ul>
          <li><strong>Object storage</strong>: We relied on StackIt's managed object storage to store hyperparameters, 
          intermediate artefacts and the final output for the pipeline. The interface is compatible with the S3 API, 
          allowing us to rely on AWS' battle-tested Rust SDK.</li>
          <li><strong>Message broker</strong>: We picked RabbitMQ to pass messages between the different components
          of the pipeline. <a href="https://crates.io/crates/lapin">lapin</a> served well as a Rust client.</li>
          <li><strong>Metadata storage</strong>: We used PostgreSQL to store metadata about the pipeline's progress. We relied on
          <a href="https://crates.io/crates/sqlx">sqlx</a> to interact with the database from Rust.</li>
          <li><strong>Compute</strong>: We relied on StackIt's managed Kubernetes offering to run the pipeline.</li>
        </ul>
    </div>  
</div>

<section class="mt-5">
        {% set imageData = {
          "imgPath": "/assets/images/work/aleph-alpha-graphs.jpg",
          "alt": "A MacBook displaying data",
          "sizes": "100vw",
          "loading": "lazy",
          "sizesArray": [760, 1440, 1920]
        } %}
        {{ imageAspectRatio(imageData, "32/13", "35/19") }}
      </section>

<div class="case-study__section">
  <h3 class="case-study__heading">Rust</h3>
    <div class="case-study__text">
      <p>The entire data pipeline was built in Rust. That's the reason Aleph Alpha reached out to Mainmatter in the first place:
      They needed someone with deep expertise in Rust to help them deliver the project.  </p>
      <p>Rust is a great fit for this kind of project as it delivers high and predictable performance, while giving you
      precise control over the memory layout of your data. That efficiency is critical when dealing with
      such a large dataset and you want to make sure you are not wasting CPU cycles or RAM.  
      But Aleph Alpha's engineering team already knows all this: They've been using Rust to power their core product 
      offering for years.</p>
      <p>Throughout the project we came to appreciate a few more advantages of using Rust:</p>
      <ul>
        <li><strong>Correctness</strong>: Rust's type system and borrow checker make it easy to write code that is correct by construction.  
        That's even <em>more</em> important on a project with such an aggressive timeline: you don't want to waste time debugging
        runtime errors or memory unsafety bugs. The more static analysis the compiler can do for you, the more confident
        you can be that your code is correct.</li>
        <li><strong>Interoperability</strong>: Aleph Alpha's AI researchers were working very closely with us on the project: tuning parameters, 
        testing filters, checking data quality, etc. Researchers, unlike engineers, are not familiar with Rust;
        Python is king in the AI research ecosystem.  
        We tried to make their lives as easy as possible while minimising the amount of time spent on rewrites.
        Researchers prototyped in Python: Using Rust's excellent Python interop capabilities, we would then 
        plug the Python code into the Rust pipeline (thanks <a href="https://crates.io/crates/pyo3">pyo3</a>!) 
        to verify its functionality and run it at scale. If the change was desirable, and we needed better performance, 
        we would then port the Python code over to Rust.</li>
        <li><strong>Ecosystem</strong>: A growing number of companies are building core machine learning infrastructure in Rust.
        As a by-product, you can find high-quality implementations of key algorithms on <a href="https://crates.io">crates.io</a>.
        A special mention goes to Hugging Face's <a href="https://github.com/huggingface/tokenizers">tokenizers</a> crate,
        a load-bearing component of the final pipeline.</li>
      </ul>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Mentoring</h3>
    <div class="case-study__text">
      <p>We split our time between delivery and mentoring.  
      Luca spent several hours a week pairing with Aleph Alpha's team, working together on the project, discussing 
      design decisions, reviewing code and sharing knowledge.</p>
      <p>Aleph Alpha's team is experienced and highly talented. Nonetheless, the entire project was on an extremely
      tight schedule: Having someone with the deep expertise on the team allowed them to <strong>move faster</strong> and <strong>avoid costly
      mistakes</strong>.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Outcome</h3>
    <div class="case-study__text">
        <p>We successfully preprocessed <strong>4.5 trillion tokens</strong> to assemble a high-quality multilingual dataset. 
        The data pipeline was designed, developed and ran on time and on budget—Aleph Alpha didn't have to delay 
        their training schedule by a single day. The data was ready to go by the time the GPU cluster was available.</p>
    </div>
</div>

{% set 'content' = {
"text": "Working with Mainmatter's experts has been a great experience. They helped us develop a state-of-the-art data pipeline, mentored our internal team and introduced several improvements around our Rust code and infrastructure along the way. I've learned so much, especially during our pairing sessions—it allowed me to improve my technical skills and grow as an engineer.",
"source": "Andreas Hartel, Senior Engineer at Aleph Alpha",
"loading": "lazy"
} %} {{ quote(content) }}
