fetch('https://digitaaltuintje.nl/webring.json')
  .then((response) => response.json())
  .then((sites) => {
    const { dataset } = getDOMStringMap('script[data-page]')

    // Find the index for the current page
    const currentIndex = findWebringIndex(
      sites,
      normalizeUrl(dataset?.page) ?? undefined,
    )

    // Generate the output based on the currentIndex
    let output = getOutputByIndex(sites, currentIndex)
      .map(
        (page) =>
          `<li><a class="${Object.keys(page)[0]}" href="${page[Object.keys(page)[0]].url}" title="Digitaal tuintje van ${page[Object.keys(page)[0]].name}"><span>${Object.keys(page)[0]}</span></a></li>`,
      )
      .reduce((accumulator, current) => accumulator + current)

    document
      .querySelector('footer')
      .insertAdjacentHTML(
        'afterbegin',
        `<nav class="webring"><h2>Digitaal Tuintje Webring</h2><ul>${output}</ul></nav>`,
      )
  })

/**
 *
 * @param {*} selector
 * @returns
 */
function getDOMStringMap(selector) {
  return (
    document.querySelector(selector) ?? {
      undefined,
    }
  )
}

/**
 *
 * @param {*} selector
 * @returns
 */
function findWebringIndex(sites, page) {
  return sites.findIndex((site) => {
    return site.url == page
  })
}

/**
 * Normalizes the passed URL, strips away [ ] characters from the example and add a trailing / if not present
 * @param {*} url - the URL to be normalized
 * @returns a normalized URL
 */
function normalizeUrl(url) {
  let output = url.replace('[', '').replace(']', '')
  return output.substr(-1) === '/' ? output : output + '/'
}

/**
 *
 * @param {*} selector
 * @returns
 */
function getOutputByIndex(sites, currentIndex) {
  if (currentIndex === -1) {
    return [{ random: getRandomSite(sites, currentIndex) }]
  } else {
    return [
      { previous: getPreviousSite(sites, currentIndex) },
      { random: getRandomSite(sites, currentIndex) },
      { next: getNextSite(sites, currentIndex) },
    ]
  }
}

/**
 *
 * @param {*} selector
 * @returns
 */
function getRandomSite(sites, currentIndex) {
  let randomSite = sites[Math.floor(Math.random() * sites.length - 1)]

  if (currentIndex != -1)
    while (
      randomSite.url == sites[currentIndex].url ||
      randomSite.url == getPreviousSite(sites, currentIndex).url ||
      randomSite.url == getNextSite(sites, currentIndex).url
    ) {
      randomSite = sites[Math.floor(Math.random() * sites.length - 1)]
    }
  return randomSite
}

/**
 *
 * @param {*} selector
 * @returns
 */
function getPreviousSite(sites, currentIndex) {
  return sites[currentIndex - 1 < 0 ? sites.length : currentIndex - 1]
}

/**
 *
 * @param {*} selector
 * @returns
 */
function getNextSite(sites, currentIndex) {
  return sites[currentIndex + 1 > sites.length - 1 ? 0 : currentIndex + 1]
}
