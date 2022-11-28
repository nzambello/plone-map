import React, { useEffect } from 'react'
import L from 'leaflet'
import { Map, TileLayer, Marker, Tooltip, Popup } from 'react-leaflet'
import MarkerClusterGroup from './MarkerClusterGroup'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

interface Props {
  center?: number[]
  markers: {
    latitude: number
    longitude: number
    onMarkerClick?: () => void
    divIcon?: L.DivIconOptions
    title?: string
    popupContent?: string | React.ReactNode | JSX.Element
  }[]
  zoom?: number
  onMarkerDragEnd?: () => void
  draggable?: boolean
  showTooltip?: boolean
  mapOptions?: { [key: string]: any }
  cluster?: boolean
  showPopup?: boolean
}

const OSMMap = ({
  center,
  markers = [],
  draggable = true,
  onMarkerDragEnd = () => {},
  zoom = 15,
  showTooltip = true,
  showPopup = true,
  cluster = true,
  mapOptions = {}
}: Props) => {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12.5, 20.5],
    shadowAnchor: [12.5, 20.5]
  })
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon
  })

  const bounds = L.latLngBounds(markers.map((marker) => [marker.latitude, marker.longitude]))

  const renderMarkers = (
    <>
      {markers.map((position, i) => (
        <Marker
          key={`${position.latitude}${position.longitude}${i}`}
          position={[position.latitude, position.longitude]}
          draggable={draggable}
          onDragend={onMarkerDragEnd}
          onClick={position.onMarkerClick}
          icon={position.divIcon ? L.divIcon(position.divIcon) : DefaultIcon}
        >
          {showTooltip && position.title && (
            <Tooltip offset={[0, -22]} direction="top">
              <strong>{position.title}</strong>
            </Tooltip>
          )}
          {showPopup && position.popupContent && (
            <Popup offset={[0, -22]} direction="top">
              {position.popupContent}
            </Popup>
          )}
        </Marker>
      ))}
    </>
  )

  return (
    <React.Fragment>
      <Map
        center={(center ?? [markers[0].latitude, markers[0].longitude]) as L.LatLngExpression}
        zoom={zoom}
        id="geocoded-result"
        bounds={bounds}
        {...mapOptions}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cluster ? <MarkerClusterGroup>{renderMarkers}</MarkerClusterGroup> : renderMarkers}
      </Map>
    </React.Fragment>
  )
}

OSMMap.propTypes = {}

export default React.memo(OSMMap)
