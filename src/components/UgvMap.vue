<template>
  <div id="map" ref="mapElement" class="h-full w-full z-0"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import { useWaypointStore } from '@/composables/useWaypointStore'
import { v4 as uuidv4 } from 'uuid'

const mapElement = ref<HTMLDivElement | null>(null)
const ugvMarker = ref<L.Marker | null>(null)
const leafletMap = ref<L.Map | null>(null)

const { addWaypoint, removeWaypoint, renameWaypoint } = useWaypointStore()
const waypointMarkers = new Map<string, L.Marker>()

const startingPoint = L.latLng(59.437, 24.7536)

onMounted(() => {
  if (mapElement.value) {
    const mapInstance = L.map(mapElement.value).setView(startingPoint, 16)
    leafletMap.value = mapInstance
    ;(window as any).leafletMap = mapInstance

    setTimeout(() => {
      mapInstance.invalidateSize()
    }, 100)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(mapInstance)


    const markerInstance = L.marker(startingPoint).addTo(mapInstance).bindPopup('UGV Start')
    ugvMarker.value = markerInstance

    mapInstance.on('contextmenu', (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng
      const tempMarker = L.marker(latlng).addTo(mapInstance)

      tempMarker.bindPopup(`
        <div>
          <strong>Waypoint</strong><br />
          <button onclick="window.dispatchEvent(new CustomEvent('waypoint-drive', { detail: ${JSON.stringify(latlng)} }))">Drive</button>
          <button onclick="window.dispatchEvent(new CustomEvent('waypoint-save', { detail: ${JSON.stringify(latlng)} }))">Save</button>
          <button onclick="window.dispatchEvent(new CustomEvent('waypoint-discard', { detail: '${(tempMarker as any)._leaflet_id}' }))">Discard</button>
        </div>
      `).openPopup()
    })

    // Waypoint sündmused
    window.addEventListener('waypoint-drive', (e: any) => {
      ugvMarker.value?.setLatLng(e.detail)
    })

    window.addEventListener('waypoint-save', (e: any) => {
      const latlng = L.latLng(e.detail.lat, e.detail.lng)
      const id = uuidv4()
      const name = `Waypoint ${Date.now()}`

      const marker = L.marker(latlng).addTo(mapInstance).bindPopup(name)
      waypointMarkers.set(id, marker)

      addWaypoint({ id, name, location: latlng })
    })

    window.addEventListener('waypoint-discard', (e: any) => {
      const id = e.detail
      mapInstance.eachLayer(layer => {
        if ((layer as any)._leaflet_id == id) {
          mapInstance.removeLayer(layer)
        }
      })
    })

    window.addEventListener('waypoint-rename', (e: any) => {
      const { id, name } = e.detail
      renameWaypoint(id, name)

      const marker = waypointMarkers.get(id)
      if (marker) {
        marker.bindPopup(name)
      }
    })

    window.addEventListener('waypoint-delete', (e: any) => {
      const id = e.detail
      const marker = waypointMarkers.get(id)
      if (marker) {
        mapInstance.removeLayer(marker)
        waypointMarkers.delete(id)
        removeWaypoint(id)
      }
    })
  }
})

defineExpose({
  map: leafletMap,
  ugvMarker
})
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
  z-index: 0;
}
</style>
