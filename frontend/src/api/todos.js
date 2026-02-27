import { api } from './http'

export const todosApi = {
  list: () => api.get('/api/todos/'),
  create: (payload) => api.post('/api/todos/', payload),
  update: (id, payload) => api.patch(`/api/todos/${id}/`, payload),
  remove: (id) => api.delete(`/api/todos/${id}/`),
}
