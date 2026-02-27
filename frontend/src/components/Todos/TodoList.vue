<script setup>
const props = defineProps({
  todos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['refresh', 'toggle', 'edit', 'delete'])
</script>

<template>
  <v-card rounded="xl" elevation="2">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Mes tâches</span>
      <v-btn :loading="loading" variant="tonal" @click="emit('refresh')"
        >Rafraîchir</v-btn
      >
    </v-card-title>

    <v-card-text>
      <div style="height: 10px; margin-bottom: 16px">
        <v-progress-linear v-if="loading" indeterminate />
      </div>

      <v-alert
        v-if="!loading && todos.length === 0"
        type="info"
        variant="tonal"
      >
        Aucune tâche pour le moment.
      </v-alert>

      <v-list v-else lines="two">
        <v-list-item v-for="todo in todos" :key="todo.id" rounded="lg">
          <template #prepend>
            <v-checkbox-btn
              :model-value="todo.completed"
              :color="todo.completed ? 'success' : 'grey'"
              @update:model-value="(val) => emit('toggle', todo, val)"
            />
          </template>

          <v-list-item-title
            :class="todo.completed ? 'text-decoration-line-through' : ''"
          >
            #{{ todo.id }} — {{ todo.title }}
          </v-list-item-title>

          <v-list-item-subtitle
            class="text-medium-emphasis"
            style="white-space: pre-wrap"
          >
            {{ todo.text }}
          </v-list-item-subtitle>

          <template #append>
            <v-btn icon variant="text" @click="emit('edit', todo)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" @click="emit('delete', todo)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
