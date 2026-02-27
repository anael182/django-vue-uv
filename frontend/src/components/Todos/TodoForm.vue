<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const formValid = ref(false)
const title = ref('')
const text = ref('')

const rules = {
  required: (value) => !!(value && String(value).trim()) || 'Champ requis',
  maxTitle: (v) => (v?.length ?? 0) <= 200 || 'Max 200 caractères',
}

function submit() {
  if (!title.value.trim()) return

  emit('add', {
    title: title.value.trim(),
    text: text.value.trim(),
  })

  title.value = ''
  text.value = ''
}
</script>

<template>
  <v-card class="mb-6" rounded="xl" elevation="2">
    <v-card-title>Ajouter une tâche</v-card-title>
    <v-card-text>
      <v-form v-model="formValid" @submit.prevent="submit">
        <v-text-field
          v-model="title"
          label="Titre"
          :rules="[rules.required, rules.maxTitle]"
          maxlength="200"
          counter
          required
        />
        <v-textarea
          v-model="text"
          label="Texte (optionnel)"
          rows="3"
          auto-grow
        />

        <v-btn type="submit" :disabled="!formValid" color="primary">
          Ajouter
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
