<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from './api'

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

const addFormValid = ref(false)
const newTitle = ref('')
const newText = ref('')

const rules = {
  required: (value) => !!(value && String(value).trim()) || 'Champ requis',
  maxTitle: (value) => (value?.length ?? 0) <= 200 || 'Max 200 caractères',
}

async function fetchTodos() {
  loading.value = true
  try {
    const res = await api.get('/api/todos/')
    todos.value = res.data
  } catch (e) {
    console.error(e)
    notify('Erreur lors du chargement des todos', 'error')
  } finally {
    loading.value = false
  }
}

async function addTodo() {
  if (!newTitle.value.trim()) return
  try {
    await api.post('/api/todos/', {
      title: newTitle.value.trim(),
      text: newText.value.trim(),
    })
    newTitle.value = ''
    newText.value = ''
    await fetchTodos()
    notify('Todo ajoutée ✅')
  } catch (e) {
    console.error(e)
    notify('Impossible d’ajouter la todo', 'error')
  }
}

async function toggleTodo(todo) {
  try {
    await api.patch(`/api/todos/${todo.id}/`, { completed: !todo.completed })
    await fetchTodos()
  } catch (e) {
    console.error(e)
    notify('Impossible de modifier le statut', 'error')
  }
}

async function deleteTodo(todo) {
  try {
    await api.delete(`/api/todos/${todo.id}/`)
    await fetchTodos()
    notify('Todo supprimée')
  } catch (e) {
    console.error(e)
    notify('Impossible de supprimer', 'error')
  }
}

const editDialog = ref(false)
const editFormValid = ref(false)
const editId = ref(null)
const editTitle = ref('')
const editText = ref('')
const editCompleted = ref(false)

function openEdit(todo) {
  editId.value = todo.id
  editTitle.value = todo.title ?? ''
  editText.value = todo.text ?? ''
  editCompleted.value = !!todo.completed
  editDialog.value = true
}

function closeEdit() {
  editDialog.value = false
  editId.value = null
  editTitle.value = ''
  editText.value = ''
  editCompleted.value = false
}

async function saveEdit() {
  if (!editId.value) return
  if (!editTitle.value.trim()) return

  try {
    await api.patch(`/api/todos/${editId.value}/`, {
      title: editTitle.value.trim(),
      text: editText.value.trim(),
      completed: editCompleted.value,
    })
    closeEdit()
    await fetchTodos()
    notify('Todo mise à jour ✅')
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
  <v-app>
    <v-main>
      <v-container class="py-8" style="max-width: 900px">
        <v-row align="center" class="mb-4">
          <v-col cols="12" md="8">
            <h1 class="text-h4 font-weight-bold">TODO</h1>
            <div class="text-medium-emphasis">
              {{ done }} / {{ total }} terminées
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <v-btn :loading="loading" variant="tonal" @click="fetchTodos">
              Rafraîchir
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="mb-6" rounded="xl" elevation="2">
          <v-card-title>Ajouter une tâche</v-card-title>
          <v-card-text>
            <v-form v-model="addFormValid" @submit.prevent="addTodo">
              <v-text-field
                v-model="newTitle"
                label="Titre"
                :rules="[rules.required, rules.maxTitle]"
                maxlength="200"
                counter
                required
              />
              <v-textarea
                v-model="newText"
                label="Texte (optionnel)"
                rows="3"
                auto-grow
              />

              <v-btn type="submit" :disabled="!addFormValid" color="primary">
                Ajouter
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card rounded="xl" elevation="2">
          <v-card-title>Mes tâches</v-card-title>
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
              <v-list-item v-for="t in todos" :key="t.id" rounded="lg">
                <template #prepend>
                  <v-checkbox-btn
                    :model-value="t.completed"
                    @update:model-value="toggleTodo(t)"
                  />
                </template>

                <v-list-item-title
                  :class="t.completed ? 'text-decoration-line-through' : ''"
                >
                  #{{ t.id }} — {{ t.title }}
                </v-list-item-title>

                <v-list-item-subtitle
                  class="text-medium-emphasis"
                  style="white-space: pre-wrap"
                >
                  {{ t.text }}
                </v-list-item-subtitle>

                <template #append>
                  <v-btn icon variant="text" @click="openEdit(t)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" @click="deleteTodo(t)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-dialog v-model="editDialog" max-width="720">
          <v-card rounded="xl">
            <v-card-title>Modifier la tâche</v-card-title>
            <v-card-text>
              <v-form v-model="editFormValid">
                <v-text-field
                  v-model="editTitle"
                  label="Titre"
                  :rules="[rules.required, rules.maxTitle]"
                  maxlength="200"
                  counter
                  required
                />
                <v-textarea
                  v-model="editText"
                  label="Texte"
                  rows="4"
                  auto-grow
                />
                <v-switch
                  v-model="editCompleted"
                  :color="editCompleted ? 'success' : 'grey'"
                  :label="editCompleted ? 'Terminée ✅' : 'En cours…'"
                />
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn variant="text" @click="closeEdit">Annuler</v-btn>
              <v-btn
                color="primary"
                :disabled="!editFormValid"
                @click="saveEdit"
              >
                Enregistrer
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500">
          {{ snackbarText }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>
