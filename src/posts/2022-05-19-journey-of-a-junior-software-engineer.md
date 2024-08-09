---
title: "Journey of a Junior Software-Engineer"
authorHandle: inesoaresilva
tags: process
bio: "Junior Software-Engineer"
og:
  image: /assets/images/posts/2022-05-19-journey-of-a-junior-software-engineer/og-image.jpg
description: "Inês Silva is currently the only junior software-engineer at Mainmatter. She shares how it is to onboard into your 1st software engineer job, and how her week at Mainmatter looks like. Also, she gives 5 main tips for other junior software engineers."
tagline: |
  <p>When do we look for our <strong>first job as software engineers</strong> some questions might
  pop up like - <strong>How will my week look like?</strong> <strong>What will be the most
  challenging parts?</strong></p>
  <p>I was in this situation one year ago, and I want to tell you how it was my
  onboarding into the professional world.</p>
  <p>This post has in mind all the future junior software engineers.</p>
  <p>I will describe <strong>what</strong> it has been like and <strong>how</strong> it is now, and try to give
  some <strong>tips</strong> on the way based on the challenges I faced 💪</p>
---

My journey at Mainmatter started in July of 2021: soon it will be 11 months that I’m here.

Before landing here, I did a 4 months internship as a Ruby backend engineer 💎 I wanted to continue to improve my backend knowledge and discover the frontend world (that I had so little insight into before)

I can stop here for the **#1 Tip** - **If you don’t know,** **start as full-stack.**

This way, you can get a better picture of both frontend and backend parts of a project and then find what fits you better or just stay in both worlds.

After the internship, I landed at Mainmatter for my 1st job 🙌

Here, I immediately started working on a web app for an IT security company. The stack was Next.js & Typescript.

As I said before I had very little experience with the frontend world, and apparently with git. 😅

My first struggles were git-related problems - I feel this is the thing that developers tend to be overconfident about.

In university, every time we started a project using git we would drop it at some point and we would go to the archaic system of copy-pasting code between us. 🥲

This was no proper way of working so my **#2 Tip - Get git rolling**

You will never be alone in a project, so force yourself to learn tools that will make you more efficient at working as a team.

Most of my colleagues always use the terminal so I found it easier to go along with this method (plus it gives you that hacker look 😎) but there is an interface option [Github Desktop](https://desktop.github.com/).

Time to jump to **#3 tip - Keep a learning journal.**

Since I was documenting all of my git struggles, I will give you a glimpse at what my notion notes were looking like in my second week here 😂:

![My note taking with notion](/assets/images/posts/2022-05-19-journey-of-a-junior-software-engineer/my-notion-notes-eg1.png)

![](/assets/images/posts/2022-05-19-journey-of-a-junior-software-engineer/my-notion-notes-eg2.png)

Git merge vs Git rebase was a frequent debate, and according to my notes, I found this enlightening video on the [topic](https://www.youtube.com/watch?v=CRlGDDprdOQ&ab_channel=Academind). Then, when I was finally becoming more comfortable with which commands I should use, they told me to tidy my git history 🧹 - [this post](https://mainmatter.com/blog/2021/05/26/keeping-a-clean-git-history/) done by Chris came in handy.

As I showed above, I keep a journal where I note down:

- bugs I came across with and how I resolved them
- key ideas on topics I researched
- things I should search more about

I believe the junior phase can be the most overwhelming one: your learning curve is in skyrocket mode 🚀! With all this new info coming all the time, I find it helpful to write everything down as a way to organize the new content in my head. Also, since a lot of errors I was seeing would show up again, I could find what I did & re-apply it.

Nowadays, I need to take notes less and less and even the pace slowed down from week logs to month logs 😆 as you can see by my notion pages:

![My pages organization in notion](/assets/images/posts/2022-05-19-journey-of-a-junior-software-engineer/my-notion-pages.png)

After git problems, the second position on the podium of challenges goes to testing 🏆

That being said we go for the **#4 Tip - Get your hands-on testing**

I don’t know how it works in other degrees, but I didn’t write a single test for my programs until I enter the professional world.

Since I’m working here, I’ve been using a JS testing framework, _[Jest](https://jestjs.io/)_ and a [\*react testing library](https://testing-library.com/docs/react-testing-library/intro/).\*

Until recently, I have wondered: ‘My code is done, why am I wasting my time with this?’ - especially when a lot of times I was losing more time in writing tests than actual code. 😅 However, a few weeks ago, the moment came when I thanked myself for having tests. 💡 I have been working on a project since September so at this point it is getting pretty big.

We are in the process of adding validations in user forms, and the tests are functioning like a bulletproof jacket. 🛡️

Multiple times I thought that my code was working well but then I ran the tests and realized I was breaking the code of other features. 🥲

My previous mentor once told me that he prefers to write the tests before his code as a way of breaking down the steps of the problem and building confidence in his code.

This style of programming is called TDD - test-driven development. In my head it looked weird - “how can I write a test before having the code?”, but I have started to do it now:

```jsx
describe("professional info is", () => {
  describe("INVALID if", () => {
    test("skills has a null value", async () => {
      const [isValid, invalidFields] = await validate(
        {
          currentSalaryRangeId: 2,
          managementExperienceId: 1,
          skills: null,
        },
        schema
      );

      expect(isValid).toBeFalsy();
      expect(invalidFields.length).toBe(1);
      expect(invalidFields[0]).toBe("skills");
    });
	}
}

```

I needed to add a validation for an input and I started with the code above, after which I would go to my validation function and change it until I made sure I was throwing an invalid response for null values.

Testing, it’s still not my cup of tea. I want to invest more in learning about it and it will probably be more enjoyable once I get better at it, so I will try to get my colleagues to pair program with me about this.

Speaking of mentors, I’m going to my last tip **#5 tip - get a mentor and jump into pair programming sessions**.

The way this goes depends on the environment within your company. Unfortunately, I see a lot of juniors that tell me that they never did pair programming with a colleague or that they get judged by the amount of time they need to accomplish their tasks.

If you land in a new job where nobody is showing availability to help you out - you are in the wrong place.

During my first 3 months at Mainmatter, I was probably pair programming at least once a week, sometimes more. Right now I'm doing it less often, which is natural - the more you progress the more independent you become.

However, I do want to go back to more regular pair programming sessions - not only is it a great way of learning, but it also makes you understand your colleagues' thinking flow better, which makes reviewing each other's code easier.

### So, how is my week as a junior dev looking now?

- I keep working with React: it has some tricky concepts that I’m still trying to fully understand, like dealing with the state of components.
- We have 1 day per week to work on open source/learning. I’m using mine to create a personal website in Ember which has been a great way of learning while doing a project that I like.
- I’m part of the culture team - we discuss topics that aim for a continuous good team environment. I’m organizing the Lunch & Learn event once a month which was born from these meetings.
- I’m having 🇫🇷 lessons, I'm happy that Mainmatter allows me to grow in other fields!

  ## Conclusion

  As (junior) software engineers, you probably have been googling and reading from websites the whole day already, so we love tldr part don't we?

Let me sum up my **tips** for you:

- **#1 If you don't know, apply for full-stack jobs.** The software development world is a wide place, if you don't know where you fit the best.
- **#2 Get git rolling.** You will never work alone, so invest a lot of learning time in tools that will make you work efficiently in a team like Git.
- **#3 Keep a learning journal** As juniors, our learning curve is on skyrocket mode, even tho we deal with computers we don't operate like them, note down your daily challenges and how you overcame them, maybe you will not read it later but it will help you tidy in your mind all the new information.
- **#4 Get your hands-on testing** I think if, before your 1st job, you were only doing personal and academic projects you were probably not introduced to testing, it may look like a waste of time at the beginning of a project but you will be thankfull when it will act like a bug-proof shield later on 🛡
- **#5 Get a mentor and jump into pair programming sessions**. Nothing speeds up our learning than having a mentor. You get to understand each other's ways of thinking, making code reviews easier. Also, being a remote software engineer can become pretty lonely, and this can counterbalance that.

Et voilá! I hope the Inês from the future will look back at this and see how much she progressed!

As for my fellow, junior software engineers, I hope this helped you in some way.

Feel free to share your challenges and progress with me. 🙂 Keep learning & stay curious!
