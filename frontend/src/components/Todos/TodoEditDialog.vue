<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  todo: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const formValid = ref(false)
const title = ref('')
const text = ref('')
const completed = ref(false)

const rules = {
  required: (v) => !!(v && String(v).trim()) || 'Champ requis',
  maxTitle: (v) => (v?.length ?? 0) <= 200 || 'Max 200 caractères',
}

watch(
  () => props.todo,
  (t) => {
    title.value = t?.title ?? ''
    text.value = t?.text ?? ''
    completed.value = !!t?.completed
  },
  { immediate: true },
)

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function save() {
  if (!props.todo?.id) return
  if (!title.value.trim()) return

  emit('save', {
    id: props.todo.id,
    title: title.value.trim(),
    text: text.value.trim(),
    completed: completed.value,
  })
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    max-width="720"
  >
    <v-card rounded="xl">
      <v-card-title>Modifier la tâche</v-card-title>

      <v-card-text>
        <v-form v-model="formValid">
          <v-text-field
            v-model="title"
            label="Titre"
            :rules="[rules.required, rules.maxTitle]"
            maxlength="200"
            counter
            required
          />
          <v-textarea v-model="text" label="Texte" rows="4" auto-grow />
          <v-switch
            v-model="completed"
            :color="completed ? 'success' : 'grey'"
            :label="completed ? 'Terminée ✅' : 'En cours…'"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Annuler</v-btn>
        <v-btn color="primary" :disabled="!formValid" @click="save"
          >Enregistrer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
