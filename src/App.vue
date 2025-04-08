<template>
  <div class="w-screen h-screen relative">
    <UgvMap ref="mapRef" />
    <EngineButton ref="engineRef" />
    <WaypointList :waypoints="waypoints" @command="handleWaypointCommand" />
    <div v-if="showNotification" class="notification">
      Start the engine to control the UGV!
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import UgvMap from './components/UgvMap.vue'
import EngineButton from './components/EngineButton.vue'
import WaypointList from './components/WaypointList.vue'
import { useUgvControl } from './composables/useUgvControl'
import { v4 as uuidv4 } from 'uuid'

const mapRef = ref()
const engineRef = ref()
const showNotification = ref(false)

const waypoints = ref([
  { id: uuidv4(), name: 'WP1', lat: 59.437, lng: 24.7536 },
  { id: uuidv4(), name: 'WP2', lat: 59.438, lng: 24.7546 },
])

const notify = () => {
  showNotification.value = true
  setTimeout(() => (showNotification.value = false), 2000)
}

useUgvControl(
  () => mapRef.value?.ugvMarker,
  () => engineRef.value?.engineOn,
  notify
)

// --- Sujuv liikumine funktsioon
const moveMarkerTo = (
  marker: L.Marker,
  targetLatLng: L.LatLngExpression,
  step = 0.0001,
  interval = 30
) => {
  const target = L.latLng(targetLatLng)
  const intervalId = setInterval(() => {
    const current = marker.getLatLng()
    const latDiff = target.lat - current.lat
    const lngDiff = target.lng - current.lng
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

    if (distance < step) {
      marker.setLatLng(target)
      clearInterval(intervalId)
      return
    }

    const moveLat = current.lat + step * (latDiff / distance)
    const moveLng = current.lng + step * (lngDiff / distance)

    marker.setLatLng([moveLat, moveLng])
  }, interval)
}

const handleWaypointCommand = (event: any) => {
  const { type, waypoint } = event
  const marker = mapRef.value?.ugvMarker
  if (!marker) return

  switch (type) {
    case 'drive':
      moveMarkerTo(marker, [waypoint.lat, waypoint.lng])
      break

    case 'rename':
      const newName = prompt('Enter new name', waypoint.name)
      if (newName) {
        waypoint.name = newName
        window.dispatchEvent(new CustomEvent('waypoint-rename', {
          detail: { id: waypoint.id, name: newName }
        }))
      }
      break

    case 'delete':
      waypoints.value = waypoints.value.filter(wp => wp.name !== waypoint.name)
      window.dispatchEvent(new CustomEvent('waypoint-delete', {
        detail: waypoint.id
      }))
      break
  }
}

onMounted(() => {
  const step = 0.0005

  const handleKeydown = (e: KeyboardEvent) => {
    if (!engineRef.value?.engineOn) {
      notify()
      return
    }

    const marker = mapRef.value?.ugvMarker
    if (!marker) return

    const current = marker.getLatLng()
    let newLat = current.lat
    let newLng = current.lng

    switch (e.key) {
      case 'ArrowUp':
        newLat += step
        break
      case 'ArrowDown':
        newLat -= step
        break
      case 'ArrowLeft':
        newLng -= step
        break
      case 'ArrowRight':
        newLng += step
        break
      default:
        return
    }

    marker.setLatLng([newLat, newLng])
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style>
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #f44336;
  color: white;
  padding: 12px 20px;
  border-radius: 5px;
  z-index: 9999;
}

.engine-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  border: 2px solid black;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  z-index: 9999;
  cursor: pointer;
}
</style>
