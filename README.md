# simplabs.github.io
  
The source code for https://simplabs.com

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

## Running with Docker

_TODO: Update the repo build to push an image to the Simplabs Docker Hub to avoid everyone having to build locally_

_TODO: Figure out why Jekyll takes so long to rebuild the site on local changes_


1. Build the image 

```
docker build -t simplabs/jekyll-serve .
```

2. Run

```
cd the/website/directory
docker run -p 8080:4000 -v $(pwd):/site simplabs/jekyll-serve
```

3. Access the site on ```locahost:8080```


Copyright &copy; 2014-2019 simplabs GmbH (https://simplabs.com), released under
the
[Creative Commons Attribution-NonCommercial 4.0 International license](https://creativecommons.org/licenses/by-nc/4.0/).
