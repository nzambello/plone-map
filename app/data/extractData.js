const cheerio = require('cheerio')
const fetch = require('cross-fetch')

const extractData = async () => {
  const res = await fetch('https://plone.org/foundation/members')
  const html = await res.text()

  const $ = cheerio.load(html)

  const membersURLs = $('article.tileItem a[title="FoundationMember"]')
    .map((_i, el) => $(el).attr('href'))
    .get()

  const members = await membersURLs.reduce(async (acc, val) => {
    const res = await fetch(val)
    const html = await res.text()

    const $m = cheerio.load(html)

    const id = val.replace('https://plone.org/foundation/members/active-members', '')
    const name = $m('h1.documentFirstHeading').text().replace(/\s+/g, ' ').trim()
    const company = $m('h1.documentFirstHeading + div > h3').text().replace(/\s+/g, ' ').trim()
    const venueName = $m('h1.documentFirstHeading + div + div > h3').text().replace(/\s+/g, ' ').trim()

    const venueRes = await fetch('https://geosuggest.herokuapp.com/api/city/suggest?pattern="' + venueName + '"')
    const venue = await venueRes.json()

    const member = {
      id,
      name,
      company,
      venue: {
        name: venueName,
        ...(venue.items.length > 0
          ? {
              name: venue.items[0].name,
              latitude: venue.items[0].latitude,
              longitude: venue.items[0].longitude,
              country: venue.items[0].country?.name,
              continent: venue.items[0].timezone?.split('/')?.[0]
            }
          : {})
      }
    }

    return [...(await acc), member]
  }, Promise.resolve([]))

  return members
}

const main = async () => {
  const members = await extractData()

  const fs = require('fs')
  const existingMembers = JSON.parse(fs.readFileSync('./members.json', 'utf8'))

  const mergedMembers = members.map((m) => {
    const existingMember = existingMembers.find((em) => em.id === m.id)
    return {
      ...(existingMember ? existingMember : {}),
      ...m,
      venue: {
        ...(existingMember?.venue ? existingMember.venue : {}),
        ...(m.venue ? m.venue : {})
      }
    }
  })

  fs.writeFileSync('./newmembers.json', JSON.stringify(mergedMembers))
}

main()
