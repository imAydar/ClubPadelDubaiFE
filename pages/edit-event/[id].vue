<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

const { getEventById, registerForEvent, confirmParticipation, removeParticipant } = useApi();

const router = useRouter()
const route = useRoute()
const api = useApi()
const eventId = route.params.id
const event = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Duration options for dropdown
const durationOptions = [
  { value: '00:30', label: '30 minutes' },
  { value: '01:00', label: '1 hour' },
  { value: '01:30', label: '1.5 hours' },
  { value: '02:00', label: '2 hours' },
  { value: '02:30', label: '2.5 hours' },
  { value: '03:00', label: '3 hours' },
  { value: '04:00', label: '4 hours' }
]

// Level options for select
const levelOptions = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Pro'
]

// Fetch event data on page load
onMounted(async () => {
  // Check for admin role
  const userRole = localStorage.getItem('userRole')
  if (userRole !== 'admin') {
    router.push('/')
    return
  }
  
  await fetchEvent()
})

// Fetch event details
const fetchEvent = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const response = getEventById(eventId)
    if (response) {
      event.value = response
    } else {
      errorMessage.value = 'Failed to load event details'
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    errorMessage.value = 'Failed to load event details'
    setTimeout(() => {
      router.push('/admin')
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// Update event
const updateEvent = async () => {
  if (!validateEventForm()) return
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    // Format the event data to match your API expectations
    const eventData = {
      id: event.value.id,
      name: event.value.name,
      date: event.value.date,
      time: event.value.time,
      location: event.value.location,
      price: parseFloat(event.value.price),
      level: event.value.level,
      duration: event.value.duration,
      sendAt: event.value.sendAt || null,
      isOnHold: event.value.isOnHold,
      maxParticipants: parseInt(event.value.maxParticipants)
    }
    
    await api.put(`/events/${eventId}`, eventData)
    successMessage.value = 'Event updated successfully!'
    
    // Refresh event data
    await fetchEvent()
  } catch (error) {
    console.error('Error updating event:', error)
    errorMessage.value = 'Failed to update event. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Form validation
const validateEventForm = () => {
  if (!event.value.name?.trim()) {
    errorMessage.value = 'Event name is required'
    return false
  }
  if (!event.value.date) {
    errorMessage.value = 'Date is required'
    return false
  }
  if (!event.value.time) {
    errorMessage.value = 'Time is required'
    return false
  }
  if (!event.value.location?.trim()) {
    errorMessage.value = 'Location is required'
    return false
  }
  return true
}

const goBack = () => {
  router.push('/admin')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <button class="back-button" @click="goBack">← Back to Admin</button>
        <h1 class="title">Edit Event</h1>
      </div>

      <div v-if="isLoading" class="loading">
        Loading event details...
      </div>
      
      <div v-else-if="errorMessage && !event" class="error-container">
        <p class="error-message">{{ errorMessage }}</p>
        <p>Redirecting to admin page...</p>
      </div>
      
      <div v-else-if="event" class="form-container">
        <div class="form-row">
          <label>Event Name</label>
          <input 
            v-model="event.name" 
            class="input-field" 
            placeholder="Enter event name"
          />
        </div>

        <div class="form-row">
          <label>Date</label>
          <input 
            v-model="event.date" 
            class="input-field" 
            type="date"
          />
        </div>

        <div class="form-row">
          <label>Time</label>
          <input 
            v-model="event.time" 
            class="input-field" 
            type="time"
          />
        </div>

        <div class="form-row">
          <label>Location</label>
          <input 
            v-model="event.location" 
            class="input-field" 
            placeholder="Enter location"
          />
        </div>

        <div class="form-row">
          <label>Price (AED)</label>
          <input 
            v-model.number="event.price" 
            class="input-field" 
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div class="form-row">
          <label>Level</label>
          <select v-model="event.level" class="input-field">
            <option v-for="level in levelOptions" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>Duration</label>
          <select v-model="event.duration" class="input-field">
            <option v-for="option in durationOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>Send Notification At</label>
          <input 
            v-model="event.sendAt" 
            class="input-field" 
            type="datetime-local"
          />
        </div>

        <div class="form-row checkbox-row">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="event.isOnHold"
            />
            Put event on hold
          </label>
        </div>

        <div class="form-row">
          <label>Max Participants</label>
          <input 
            v-model.number="event.maxParticipants" 
            class="input-field" 
            type="number"
            min="2"
            max="16"
          />
        </div>

        <div class="form-row">
          <button 
            @click="updateEvent" 
            class="update-button" 
            :disabled="isLoading"
          >
            💾 Update Event
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  padding: 20px;
  background: #0d1117;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  width: 100%;
  max-width: 800px;
  padding: 32px;
  background: #1a1d24;
  border-radius: 16px;
  color: white;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-button {
  background: transparent;
  border: none;
  color: #58a6ff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}

.title {
  color: #58a6ff;
  font-size: 2rem;
  margin: 0;
}

.loading, .error-container {
  text-align: center;
  padding: 40px 0;
  color: #8b949e;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 16px;
}

.form-row label {
  color: #8b949e;
  font-size: 0.9rem;
  text-align: right;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
  height: 36px;
}

.input-field:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
}

.checkbox-row {
  grid-template-columns: 1fr;
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #8b949e;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

select.input-field {
  appearance: none;
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.update-button {
  grid-column: 1 / -1;
  padding: 12px;
  background: #238636;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;
}

.update-button:hover:not(:disabled) {
  background: #2ea043;
  transform: translateY(-1px);
}

.update-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  grid-column: 1 / -1;
  color: #f85149;
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
}

.success-message {
  grid-column: 1 / -1;
  color: #3fb950;
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .form-row label {
    text-align: left;
  }
}
</style> 