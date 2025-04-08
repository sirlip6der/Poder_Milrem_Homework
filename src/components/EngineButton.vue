<template>
  <button
    @click="toggleEngine"
    class="fixed top-4 right-4 bg-gray-500 opacity-80 text-white border-black border-2 px-4 py-2 rounded"
  >
    <span v-if="!engineOn">🚗 Start Engine</span>
    <span v-else>🛑 Stop Engine</span>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const engineOn = ref(false)

const toggleEngine = () => {
  engineOn.value = !engineOn.value
}

defineExpose({ engineOn, toggleEngine })
</script>
