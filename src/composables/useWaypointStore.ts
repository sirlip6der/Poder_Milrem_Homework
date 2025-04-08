import { ref } from 'vue'
import L, { LatLng } from 'leaflet'

export type Waypoint = {
  id: string
  name: string
  location: LatLng
}

const waypoints = ref<Waypoint[]>([])

export function useWaypointStore() {
  const addWaypoint = (wp: Waypoint) => {
    waypoints.value.push(wp)
  }

  const removeWaypoint = (id: string) => {
    waypoints.value = waypoints.value.filter(wp => wp.id !== id)
  }

  const renameWaypoint = (id: string, newName: string) => {
    const wp = waypoints.value.find(w => w.id === id)
    if (wp) wp.name = newName
  }

  const getWaypoints = () => waypoints.value

  return { addWaypoint, removeWaypoint, renameWaypoint, getWaypoints, waypoints }
}
