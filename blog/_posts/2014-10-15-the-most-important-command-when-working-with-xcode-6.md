---
layout: article
section: Blog
title: "The most important command when working with XCode 6"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
topic: ios
---

```bash
defaults write com.apple.CrashReporter DialogType none
```

This disables the Crash Reporter window that shows when SourceKitService crashes (which is all the time). So while it doesn’t prevent SourceKitService from crashing at least you don’t have to click that window away anymore.