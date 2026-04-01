import axios from 'axios'

// En desarrollo: VITE_API_URL está vacío → Vite hace proxy a localhost:8000
// En producción: VITE_API_URL = https://tu-backend.railway.app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

// Helper to get selected exam from localStorage
const getSelectedExam = () => localStorage.getItem('selectedExam') || 'ai_practitioner'

export const getExams = async () => {
  const response = await api.get('/api/exams')
  return response.data
}

export const getTopics = async (examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/topics`)
  return response.data
}

export const getQuiz = async (topic, difficulty, numQuestions = 10, examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/quiz/${topic}/${difficulty}`, {
    params: { num_questions: numQuestions }
  })
  return response.data
}

export const getAnswers = async (topic, difficulty, examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/quiz/${topic}/${difficulty}/answers`)
  return response.data
}

export const saveResult = async (resultData) => {
  const response = await api.post('/api/results', resultData)
  return response.data
}

export const getStats = async (examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/stats`)
  return response.data
}

export const getTopicStats = async (topic, examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/stats/${topic}`)
  return response.data
}

export const exportCSV = async (examId = getSelectedExam()) => {
  const response = await api.get(`/api/${examId}/export/csv`, {
    responseType: 'blob'
  })
  return response.data
}

export default api
