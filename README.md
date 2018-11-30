# eno-lang.org

The eno-lang.org website

## Working on the website

All website content is found in `.eno` files inside subfolders in `src/`, they are descriptively named and the insides should be fairly self explanatory as well - feel free to open an issue if something is unclear!

### Previewing your changes locally

First install all packages:

    npm i

Then build the page:

    npm run build

Continuous rebuilds are also offered through:

    npm run watch

In the same or another terminal run:

    npm run serve

Observe the output of `npm run serve` to get the local server address, most likely it will be `localhost:8080`, unless the port is occupied already.
