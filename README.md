# Poder_Milrem_Homework

This project is a prototype interface for controlling an Unmanned Ground Vehicle (UGV) system. It is built using Vue 3, TypeScript, Leaflet, HTML, and CSS. The application demonstrates UGV movement, waypoint planning, and map integration with basic engine control.

## Installation:
1. Install dependencies
    npm install
2. Start development server
    npm run dev
3. Build for production
    npm run build
4. Open in localhost
    http://localhost:5173/

## Objective:
This project is a prototype interface for controlling an Unmanned Ground            Vehicle(UGV) system, built using Vue 3, TypeScript, Leaflet, HTML, and CSS.
It demonstrates UGV movement, waypoint planning, and map integration with basic engine control.

## Features:

## Map Integration:
Uses Leaflet to display a live interactive map
UGV starts at a predefined location
Long-press to add waypoints on the map

## Engine Control & Movement:
Engine toggle button (top-right corner with icon)
UGV can be moved using arrow keys (only when engine is started)
If keys pressed without engine running, a warning popup appears

## Waypoint System:
Add waypoint via map (right-click/long press)
Waypoint popup with actions:
    Drive – moves UGV to that point
    Save – saves the waypoint
    Discard – removes it from the map

## Saved Waypoints Panel:
View a list of saved waypoints.
Each saved waypoint has actions:
    Drive – Moves UGV to the waypoint location.
    Rename – Change the name of the waypoint.
    Delete – Removes the waypoint from the saved list.
    
## Notes:
This prototype does not control real hardware; the movement and engine controls are simulated.
All data (such as waypoints) is stored in-memoryusing a simple store (via `useWaypointStore`) with no persistence between sessions.
The user interface is intentionally minimal to focus on core functionality, and can be enhanced in the future.

## Difficulties & Reflections:
The most time-consuming part was managing custom map popups with HTML-injected buttons that trigger Vue-compatible behavior. It required bridging the gap between Leaflet’s native DOM events and Vue's reactivity system, especially with the use of `window.dispatchEvent()` to trigger Vue's state changes.

## Tech Stack:
Vue 3 (Composition API)
TypeScript
Vite
Leaflet
Tailwind CSS (optional, depending on final styling)

## Folder Structure:
src/
├── components/
│   ├── UgvMap.vue
│   ├── EngineToggle.vue
│   └── WaypointList.vue
├── composables/
│   └── useWaypointStore.ts
└── App.vue

## AI Assistance:
I used ChatGPT to help me:
Finding an idea
Correcting and checking errors
