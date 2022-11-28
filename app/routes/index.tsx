import { LinksFunction } from '@remix-run/react/dist/routeModules'
import { Form, useLoaderData } from '@remix-run/react'
import styles from '../styles/OSMMap.css'
import members from '../data/members.json'
import { json, LoaderArgs } from '@remix-run/cloudflare'
import OSMMap from '~/components/OSMMap.client'
import { ClientOnly } from 'remix-utils'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
    integrity: 'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: styles
  }
]

type Member = {
  id: string
  name: string
  company?: string
  venue?: {
    name: string
    latitude?: number
    longitude?: number
    country?: string
    continent?: string
  }
}

type LoaderData = {
  members: Member[]
  total: number
  continents?: string[]
  continent?: string
  countries?: string[]
  country?: string
  companies?: string[]
  company?: string
  searchableText?: string
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const continent = url.searchParams.get('continent')
  const country = url.searchParams.get('country')
  const company = url.searchParams.get('company')
  const searchableText = url.searchParams.get('searchableText')

  const membersFiltered = members.filter((member: Member) => {
    let memberSearchableText = (member.name + (member.company ?? '') + (member.venue?.name ?? ''))
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
    if (continent && member.venue?.continent !== continent) {
      return false
    }
    if (country && member.venue?.country !== country) {
      return false
    }
    if (searchableText && !memberSearchableText.includes(searchableText)) {
      return false
    }
    if (company && member.company !== company) {
      return false
    }
    return true
  })

  const countries = members
    .reduce((acc: string[], member: Member) => {
      if (member.venue?.country && !acc.includes(member.venue.country)) {
        return [...acc, member.venue.country]
      }
      return acc
    }, [])
    .sort((a, b) => a.localeCompare(b))

  const continents = members
    .reduce((acc: string[], member: Member) => {
      if (member.venue?.continent && !acc.includes(member.venue.continent)) {
        return [...acc, member.venue.continent]
      }
      return acc
    }, [])
    .sort((a, b) => a.localeCompare(b))

  const companies = members
    .reduce((acc: string[], member: Member) => {
      if (member.company && !acc.includes(member.company)) {
        return [...acc, member.company]
      }
      return acc
    }, [])
    .sort((a, b) => a.localeCompare(b))

  return json({
    total: members.length,
    members: membersFiltered,
    continent,
    continents,
    country,
    countries,
    company,
    companies,
    searchableText
  })
}

export default function Index() {
  const { total, members, company, companies, continent, continents, country, countries, searchableText } =
    useLoaderData() as LoaderData

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <figure style={{ float: 'left', marginLeft: 0 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="158.253px"
          height="40.686px"
          viewBox="0 0 158.253 40.686"
          enable-background="new 0 0 158.253 40.686"
          xmlSpace="preserve"
        >
          <g>
            <path
              fill="#006c9d"
              d="M65.327,23.208h-6.589v11.388h-4.393V5.638h10.981c5.653,0,9.271,3.742,9.271,8.785                 S70.979,23.208,65.327,23.208z M65.082,9.583h-6.345v9.639h6.345c3.05,0,5.124-1.749,5.124-4.799                 C70.206,11.372,68.132,9.583,65.082,9.583z"
            ></path>
            <path
              fill="#006c9d"
              d="M83.969,34.596c-3.904,0-5.652-2.644-5.652-5.693V5.638h4.148v23.021c0,1.587,0.567,2.399,2.235,2.399h1.83                 v3.538H83.969z"
            ></path>
            <path
              fill="#006c9d"
              d="M104.762,32.399c-1.344,1.384-3.377,2.44-6.184,2.44c-2.805,0-4.799-1.058-6.141-2.44                 c-1.951-2.032-2.439-4.637-2.439-8.134c0-3.457,0.488-6.061,2.439-8.094c1.342-1.383,3.336-2.44,6.141-2.44                 c2.807,0,4.84,1.059,6.184,2.44c1.951,2.033,2.439,4.637,2.439,8.094C107.203,27.763,106.713,30.366,104.762,32.399z                  M101.629,18.613c-0.773-0.773-1.83-1.181-3.051-1.181c-1.219,0-2.236,0.406-3.01,1.181c-1.26,1.261-1.422,3.416-1.422,5.652                 s0.162,4.393,1.422,5.653c0.773,0.771,1.791,1.22,3.01,1.22c1.221,0,2.277-0.447,3.051-1.22c1.262-1.262,1.424-3.417,1.424-5.653                 S102.891,19.873,101.629,18.613z"
            ></path>
            <path
              fill="#006c9d"
              d="M123.643,34.596V22.029c0-3.214-1.83-4.597-4.147-4.597s-4.271,1.423-4.271,4.597v12.566h-4.147v-20.62                 h4.065v2.074c1.425-1.546,3.416-2.318,5.49-2.318c2.115,0,3.865,0.691,5.084,1.871c1.586,1.545,2.074,3.497,2.074,5.815v13.178                 L123.643,34.596L123.643,34.596z"
            ></path>
            <path
              fill="#006c9d"
              d="M135.772,25.486c0,3.537,1.871,5.774,5.246,5.774c2.317,0,3.539-0.649,5.004-2.115l2.643,2.481                 c-2.115,2.114-4.107,3.213-7.727,3.213c-5.166,0-9.273-2.725-9.273-10.574c0-6.671,3.457-10.534,8.744-10.534                 c5.531,0,8.744,4.067,8.744,9.925v1.83H135.772z M144.475,19.791c-0.65-1.545-2.113-2.604-4.066-2.604                 c-1.951,0-3.457,1.059-4.107,2.604c-0.406,0.936-0.488,1.546-0.529,2.807h9.273C145.003,21.337,144.883,20.726,144.475,19.791z"
            ></path>
            <circle fill="#006c9d" cx="17.815" cy="11.516" r="4.402"></circle>
            <path
              fill="#006c9d"
              d="M31.167,20.311c0,2.433-1.969,4.401-4.403,4.401c-2.427,0-4.401-1.97-4.401-4.401                 c0-2.433,1.975-4.401,4.401-4.401C29.2,15.909,31.167,17.879,31.167,20.311z"
            ></path>
            <circle fill="#006c9d" cx="17.801" cy="29.131" r="4.402"></circle>
            <g>
              <path
                fill="#006c9d"
                d="M20.441-0.045C9.207-0.044,0.1,9.063,0.099,20.298C0.1,31.532,9.207,40.639,20.441,40.641                     c11.235-0.002,20.341-9.107,20.343-20.343C40.783,9.063,31.677-0.044,20.441-0.045z M31.891,31.747                     c-2.937,2.934-6.972,4.742-11.45,4.743c-4.478-0.001-8.513-1.811-11.45-4.743C6.058,28.81,4.25,24.775,4.249,20.298                     c0.001-4.478,1.809-8.513,4.743-11.45c2.937-2.934,6.972-4.742,11.45-4.743c4.478,0.001,8.513,1.81,11.45,4.743                     c2.934,2.938,4.742,6.973,4.743,11.45C36.633,24.775,34.825,28.81,31.891,31.747z"
              ></path>
            </g>
            <g>
              <path
                fill="#006c9d"
                d="M153.985,9.95c-1.195,0-2.164,0.971-2.164,2.168c0.002,1.197,0.969,2.168,2.164,2.168                     c1.199,0,2.172-0.971,2.172-2.168S155.184,9.95,153.985,9.95z M153.985,13.968c-1.021-0.002-1.846-0.827-1.846-1.85                     c0.002-1.021,0.825-1.849,1.846-1.851c1.023,0.002,1.852,0.828,1.854,1.851C155.836,13.141,155.008,13.966,153.985,13.968z"
              ></path>
            </g>
            <g>
              <path
                fill="#006c9d"
                d="M154.507,13.409l-0.54-1.08h-0.486v1.08h-0.389v-2.564h0.994c0.484,0,0.796,0.313,0.796,0.75                     c0,0.367-0.224,0.602-0.513,0.68l0.592,1.136L154.507,13.409L154.507,13.409z M154.056,11.195h-0.575v0.803h0.575 c0.261,0,0.437-0.147,0.437-0.399S154.317,11.195,154.056,11.195z"
              ></path>
            </g>
          </g>
        </svg>
      </figure>
      <h1>The Plone Map™️</h1>
      <p style={{ fontSize: '1.25em' }}>This is a map of Plone Foundation members.</p>
      <p>
        All the data belogs to the members and the{' '}
        <a href="https://plone.org/foundation" target="_blank" rel="noopener noreferrer">
          Plone Foundation
        </a>{' '}
        and it is extracted and periodically updated from{' '}
        <a href="https://plone.org/foundation/members" target="_blank" rel="noopener noreferrer">
          plone.org/foundation/members
        </a>
        .
      </p>

      <nav>
        <p>
          <a href="https://github.com/nzambello/plone-map" target="_blank" rel="noopener noreferrer">
            Source code
          </a>
        </p>
      </nav>

      <Form method="get" action="/">
        <fieldset>
          <legend>
            <h2>Filters</h2>
          </legend>
          <div style={{ marginBottom: '0.5em' }}>
            <label htmlFor="searchableText" style={{ display: 'inline-block', minWidth: 90 }}>
              Search:{' '}
            </label>
            <input
              type="search"
              name="searchableText"
              id="searchableText"
              defaultValue={searchableText}
              style={{ minWidth: 300 }}
            />
          </div>
          {continents && (
            <div style={{ marginBottom: '0.5em' }}>
              <label htmlFor="continent" style={{ display: 'inline-block', minWidth: 90 }}>
                Continent:{' '}
              </label>
              <select name="continent" id="continent" defaultValue={continent} style={{ width: 300 }}>
                <option value="">All</option>
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
            </div>
          )}
          {countries && (
            <div style={{ marginBottom: '0.5em' }}>
              <label htmlFor="country" style={{ display: 'inline-block', minWidth: 90 }}>
                Country:{' '}
              </label>
              <select name="country" id="country" defaultValue={country} style={{ width: 300 }}>
                <option value="">All</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          )}
          {companies && (
            <div style={{ marginBottom: '0.5em' }}>
              <label htmlFor="company" style={{ display: 'inline-block', minWidth: 90 }}>
                Company:{' '}
              </label>
              <select name="company" id="company" defaultValue={company} style={{ width: 300 }}>
                <option value="">All</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={{ marginTop: '1em' }}>
            <button type="submit">Filter</button>
          </div>
        </fieldset>
      </Form>

      {members.length > 0 && (
        <p>
          Shown {members.length} members of {total}
        </p>
      )}

      {members.length > 0 && (
        <ClientOnly
          fallback={
            <div>
              <p>Loading...</p>
            </div>
          }
        >
          {() => (
            <OSMMap
              markers={members
                .filter((m) => !!m.venue?.latitude && !!m.venue.longitude)
                .map((member) => ({
                  latitude: member.venue?.latitude!,
                  longitude: member.venue?.longitude!,
                  title: member.name,
                  popupContent: (
                    <div>
                      <h3>{member.name}</h3>
                      <strong>{member.venue?.name}</strong> ({member.venue?.country})
                      {member.company && <p>Company: {member.company}</p>}
                      <a
                        href={`https://plone.org/foundation/members/active-members${member.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        More info
                      </a>
                    </div>
                  )
                }))}
              showTooltip
              mapOptions={{
                scrollWheelZoom: false
                // tap: false,
                // dragging: false,
              }}
            />
          )}
        </ClientOnly>
      )}

      {!!members?.length ? (
        <>
          <h2>Members</h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
            }}
          >
            {members.map((m) => (
              <li
                key={m.id}
                style={{
                  boxShadow: '0 0 1em rgba(0, 0, 0, 0.15)',
                  borderRadius: 10,
                  margin: '1em',
                  padding: '0.5em 1em'
                }}
              >
                <h3>
                  <a
                    href={`https://plone.org/foundation/members/active-members${m.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.name}
                  </a>
                </h3>
                <p>
                  <i>Company</i>: {m.company}
                </p>
                <p>
                  <i>Location</i>: {m.venue?.name}, {m.venue?.country}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No members found</p>
      )}
    </div>
  )
}
