<template>
  <div class="waypoint-list">
    <h3>Waypoints</h3>
    <div
      v-for="wp in waypoints"
      :key="wp.id"
      class="waypoint-item"
    >
      <div class="waypoint-name">{{ wp.name }}</div>
      <div class="waypoint-buttons">
        <button @click="() => emitCommand('drive', wp)">Drive</button>
        <button @click="() => emitCommand('rename', wp)">Rename</button>
        <button @click="() => emitCommand('delete', wp)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  waypoints: { id: string; name: string; lat: number; lng: number }[]
}>()

const emit = defineEmits(['command'])

const emitCommand = (type: string, waypoint: any) => {
  emit('command', { type, waypoint })
}
</script>

<style scoped>
.waypoint-list {
  position: absolute;
  top: 80px;
  left: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  width: 240px;
  z-index: 9999; /* tõstame kindlalt kaardi peale */
}


h3 {
  margin-top: 0;
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.waypoint-item {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.waypoint-name {
  font-weight: 500;
  margin-bottom: 6px;
}

.waypoint-buttons button {
  margin-right: 6px;
  padding: 4px 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #eee;
  transition: background-color 0.2s;
}

.waypoint-buttons button:hover {
  background-color: #ccc;
}
</style>
