---
title: "The most important command when working with XCode 6"
authorHandle: marcoow
bio: "Founding Director of simplabs, author of Ember Simple Auth"
description:
  "Marco Otte-Witte shows how to disable XCode 6's crash reporter dialog for a
  less annoying development experience."
tags: misc
---

Switching off XCode's Crash Reporter saved my day.

<!--break-->

```bash
defaults write com.apple.CrashReporter DialogType none
```

This disables the Crash Reporter window that shows when SourceKitService crashes
(which is all the time). So while it doesn’t prevent SourceKitService from
crashing at least you don’t have to click that window away anymore.
