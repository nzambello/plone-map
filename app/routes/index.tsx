import { LinksFunction } from '@remix-run/react/dist/routeModules'
import { useLoaderData } from '@remix-run/react'
import styles from '../styles/OSMMap.css'
import members from '../data/members.json'
import { json } from '@remix-run/cloudflare'
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

export const loader = async () => {
  return json({ members })
}

export default function Index() {
  const { members } = useLoaderData() as { members: Member[] }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
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
                    <strong>{member.venue?.name}</strong>
                    {member.company && <p>Company: {member.company}</p>}
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

      {!!members?.length && (
        <ul>
          {members.map((m) => (
            <li key={m.id}>
              <h2>{m.name}</h2>
              <p>{m.company}</p>
              <p>{m.venue?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
