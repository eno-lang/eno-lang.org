# eno-lang.org

Language guide and specification, interactive tools, library documentation, blog and more 

## Working on the website

All website content is found in `.eno` files inside `content/`, they are descriptively named and the insides should be fairly self explanatory as well - feel free to open an issue if something is unclear!

### Previewing your changes locally

First install all packages:

    npm i

Then continuously (re)build and serve the page with:

    npm run watch

To get the local server port observe the last lines outputted from `npm run watch`, most likely it will be `localhost:8080`, unless the port is occupied already.
