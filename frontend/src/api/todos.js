import { http } from './http'

export const todosApi = {
  list: () => http.get('/api/todos/'),
  create: (payload) => http.post('/api/todos/', payload),
  update: (id, payload) => http.patch(`/api/todos/${id}/`, payload),
  remove: (id) => http.delete(`/api/todos/${id}/`),
}
