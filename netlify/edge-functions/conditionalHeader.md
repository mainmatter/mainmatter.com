# How conditionalHeader edge function works

When the user navigates to simplabs he will be redirected to mainmatter based on
redirect rules set in `netlify.toml`. It is redirect to a different domain so
the only way how we can sent an information that header should be visible is by
setting a query param `simplabs=true`. When user navigates to a different link
on mainmatter, the query param is removed, so when there is a query param
`simplabs=true` session cookie `simplabs=true` is set. So `conditionalHeader`
edge function checks if the session cookie `simplabs=true` is present, if it is,
the header is not removed.

## How to test `conditionalHeader` edge function

1. add `simplabs.com` and `mainmatter.com` to your /etc/hosts file
2. Uncomment the redirect rule in `netlify.toml` file
   > note: it will redirect `http://simplabs.com:8888/contact` to
   > `http://mainmatter.com:8888/` that way we can test redirect to a different
   > domain

```
[[redirects]]
  from = "/contact"
  to = "http://mainmatter.com:8888/"
  status = 301
  force = false
```

3. run `netlify dev`
4. Navigate to [simplabs.com:8888/contact](http://simplabs.com:8888/contact)
5. You will be redirected to `mainmatter.com:8888` with a query param
   `simplabs=true` and header will be wisible
6. Navigate to any other link on `mainmatter.com:8888`, header will be visible
   untill browser is closed and navigated to mainmatter.com:8888 again

For debugging, run the following command
`netlify dev --edgeInspect=127.0.0.1:9229`, then open chrome and navigate to
`chrome://inspect`.
