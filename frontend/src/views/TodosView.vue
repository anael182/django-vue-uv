<script setup>
import { ref, computed, onMounted } from 'vue'
import { todosApi } from '../api/todos'

import TodoForm from '../components/Todos/TodoForm.vue'
import TodoList from '../components/Todos/TodoList.vue'
import TodoEditDialog from '../components/Todos/TodoEditDialog.vue'

const todos = ref([])
const loading = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
function notify(text, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

async function fetchTodos() {
  loading.value = true
  try {
    const res = await todosApi.list()
    todos.value = res.data
  } catch (e) {
    console.error(e)
    notify('Erreur lors du chargement des tâches', 'error')
  } finally {
    loading.value = false
  }
}

async function handleAdd(payload) {
  try {
    await todosApi.create(payload)
    await fetchTodos()
    notify('Tâche ajoutée ✅')
  } catch (e) {
    console.error(e)
    notify('Impossible d’ajouter la tâche', 'error')
  }
}

async function handleToggle(todo, val) {
  try {
    await todosApi.update(todo.id, { completed: val })
    await fetchTodos()
  } catch (e) {
    console.error(e)
    notify('Impossible de modifier le statut', 'error')
  }
}

async function handleDelete(todo) {
  try {
    await todosApi.remove(todo.id)
    await fetchTodos()
    notify('Tâche supprimée')
  } catch (e) {
    console.error(e)
    notify('Impossible de supprimer', 'error')
  }
}

const editOpen = ref(false)
const editTodo = ref(null)

function openEdit(todo) {
  editTodo.value = todo
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  editTodo.value = null
}

async function handleSaveEdit(payload) {
  try {
    await todosApi.update(payload.id, {
      title: payload.title,
      text: payload.text,
      completed: payload.completed,
    })
    closeEdit()
    await fetchTodos()
    notify('Tâche mise à jour ✅')
  } catch (e) {
    console.error(e)
    notify('Impossible d’enregistrer', 'error')
  }
}

const total = computed(() => todos.value.length)
const done = computed(() => todos.value.filter((t) => t.completed).length)

onMounted(fetchTodos)
</script>

<template>
  <v-container class="py-8" style="max-width: 900px">
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold">TODO</h1>
        <div class="text-medium-emphasis">
          {{ done }} / {{ total }} terminées
        </div>
      </v-col>
    </v-row>

    <TodoForm @add="handleAdd" />

    <TodoList
      :todos="todos"
      :loading="loading"
      @refresh="fetchTodos"
      @toggle="handleToggle"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <TodoEditDialog
      v-model="editOpen"
      :todo="editTodo"
      @save="handleSaveEdit"
      @cancel="closeEdit"
    />

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>
