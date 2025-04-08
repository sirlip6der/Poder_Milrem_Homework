import { onMounted, onUnmounted } from 'vue'
import L from 'leaflet'

export function useUgvControl(
  getMarker: () => L.Marker | null,
  isEngineOn: () => boolean,
  showNotification: () => void
) {
  const moveStep = 0.0005

  const move = (dx: number, dy: number) => {
    const marker = getMarker()
    if (!marker) return
    const current = marker.getLatLng()
    const newLatLng = L.latLng(current.lat + dy, current.lng + dx)
    marker.setLatLng(newLatLng)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEngineOn()) {
      showNotification()
      return
    }

    switch (e.key) {
      case 'ArrowUp':
        move(0, moveStep)
        break
      case 'ArrowDown':
        move(0, -moveStep)
        break
      case 'ArrowLeft':
        move(-moveStep, 0)
        break
      case 'ArrowRight':
        move(moveStep, 0)
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
}
