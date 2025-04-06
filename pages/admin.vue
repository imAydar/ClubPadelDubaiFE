<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const router = useRouter()
const api = useApi()
//const events = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const { events, fetchEvents, createEvent, auth } = useApi();

const newEvent = ref({
  name: '',
  date: '',
  time: '',
  location: '',
  price: 0,
  level: 'Beginner',
  duration: '01:00',
  sendAt: '',
  isOnHold: false,
  maxParticipants: 4
})

const levelOptions = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Pro'
]

// Authentication check and fetch events
onMounted(async () => {
  const userRole = localStorage.getItem('userRole')
  if (userRole !== 'admin') {
    router.push('/')
    return
  }
  await fetchEvents()
})

// Create new event
const handleCreateEvent = async () => {
  if (!validateEventForm()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const eventData = {
      name: newEvent.value.name,
      date: newEvent.value.date,
      time: newEvent.value.time,
      location: newEvent.value.location,
      price: parseFloat(newEvent.value.price),
      level: newEvent.value.level,
      duration: newEvent.value.duration,
      sendAt: newEvent.value.sendAt || null,
      isOnHold: newEvent.value.isOnHold,
      maxParticipants: parseInt(newEvent.value.maxParticipants)
    }

    await createEvent(eventData);

    await fetchEvents()
    resetForm()
  } catch (error) {
    console.error('Error creating event:', error)
    errorMessage.value = 'Failed to create event. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Delete event
const deleteEvent = async (eventId) => {
  if (!confirm('Are you sure you want to delete this event?')) return
  
  try {
    isLoading.value = true
    await api.delete(`/events/${eventId}`)
    await fetchEvents()
  } catch (error) {
    console.error('Error deleting event:', error)
    errorMessage.value = 'Failed to delete event. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Form validation
const validateEventForm = () => {
  if (!newEvent.value.name?.trim()) {
    errorMessage.value = 'Event name is required'
    return false
  }
  if (!newEvent.value.date) {
    errorMessage.value = 'Date is required'
    return false
  }
  if (!newEvent.value.time) {
    errorMessage.value = 'Time is required'
    return false
  }
  if (!newEvent.value.location?.trim()) {
    errorMessage.value = 'Location is required'
    return false
  }
  return true
}

// Reset form
const resetForm = () => {
  newEvent.value = {
    name: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    level: 'Beginner',
    duration: '01:00',
    sendAt: '',
    isOnHold: false,
    maxParticipants: 4
  }
  errorMessage.value = ''
}

const goBack = () => {
  router.push('/')
}

const editEvent = (id) => {
  router.push(`/edit-event/${id}`)
}
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <button class="back-button" @click="goBack">← Back</button>
        <h1 class="title">Admin Dashboard</h1>
      </div>

      <h2 class="section-title">Create New Event</h2>
      
      <div class="form-container">
        <div class="form-row">
          <label>Event Name</label>
          <input 
            v-model="newEvent.name" 
            class="input-field" 
            placeholder="Enter event name"
          />
        </div>

        <div class="form-row">
          <label>Date</label>
          <input 
            v-model="newEvent.date" 
            class="input-field" 
            type="date"
            placeholder="mm/dd/yyyy"
          />
        </div>

        <div class="form-row">
          <label>Time</label>
          <input 
            v-model="newEvent.time" 
            class="input-field" 
            type="time"
          />
        </div>

        <div class="form-row">
          <label>Location</label>
          <input 
            v-model="newEvent.location" 
            class="input-field" 
            placeholder="Enter location"
          />
        </div>

        <div class="form-row">
          <label>Price (AED)</label>
          <input 
            v-model.number="newEvent.price" 
            class="input-field" 
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div class="form-row">
          <label>Level</label>
          <select v-model="newEvent.level" class="input-field">
            <option v-for="level in levelOptions" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>Duration<br/>(hours:minutes)</label>
          <input 
            v-model="newEvent.duration" 
            class="input-field" 
            type="time"
            step="300"
          />
        </div>

        <div class="form-row">
          <label>Send Notification At</label>
          <input 
            v-model="newEvent.sendAt" 
            class="input-field" 
            type="datetime-local"
          />
        </div>

        <div class="form-row checkbox-row">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="newEvent.isOnHold"
            />
            Put event on hold
          </label>
        </div>

        <div class="form-row">
          <label>Max Participants</label>
          <input 
            v-model.number="newEvent.maxParticipants" 
            class="input-field" 
            type="number"
            min="2"
            max="16"
          />
        </div>

        <div class="form-row">
          <button 
            @click="handleCreateEvent" 
            class="create-button" 
            :disabled="isLoading"
          >
            ✨ Create Event
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <div class="divider"></div>

      <h2 class="section-title">Manage Events</h2>
      
      <div v-if="isLoading" class="status-message">
        Loading events...
      </div>
      
      <div v-else-if="events.length === 0" class="status-message">
        No events available.
      </div>
      
      <div v-else class="events-list">
        <div v-for="event in events" :key="event.id" class="event-item">
          <div class="event-header">
            <h3 class="event-title">{{ event.name }}</h3>
            <button @click="editEvent(event.id)" class="edit-button" :disabled="isLoading">
                ✏️
            </button>
            <button 
              @click="deleteEvent(event.id)" 
              class="delete-button"
              :disabled="isLoading"
            >
              🗑️
            </button>
          </div>
          <div class="event-details">
            <p><span class="icon">📅</span> {{ event.date }} at {{ event.time }}</p>
            <p><span class="icon">📍</span> {{ event.location }}</p>
            <p><span class="icon">💰</span> {{ event.price }} AED</p>
            <p><span class="icon">⭐</span> Level: {{ event.level }}</p>
            <p><span class="icon">⏱️</span> Duration: {{ event.duration }}</p>
            <p><span class="icon">👥</span> Max Participants: {{ event.maxParticipants }}</p>
            <p v-if="event.isOnHold" class="on-hold"><span class="icon">⏸️</span> On Hold</p>
          </div>
        </div>
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

.section-title {
  color: #58a6ff;
  font-size: 1.5rem;
  margin: 0 0 24px 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
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

.create-button {
  grid-column: 1 / -1;
  padding: 12px;
  background: #58a6ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;
}

.create-button:hover:not(:disabled) {
  background: #4993e6;
  transform: translateY(-1px);
}

.create-button:disabled {
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

.divider {
  height: 1px;
  background: #30363d;
  margin: 32px 0;
}

.status-message {
  text-align: center;
  color: #8b949e;
  padding: 24px;
  border: 2px dashed #30363d;
  border-radius: 6px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  padding: 16px;
  background: #21262d;
  border-radius: 8px;
  border: 1px solid #30363d;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-title {
  color: #58a6ff;
  font-size: 1.2rem;
  margin: 0;
}

.delete-button {
  background: transparent;
  border: none;
  color: #f85149;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-button:hover:not(:disabled) {
  background: rgba(248, 81, 73, 0.1);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.event-details {
  color: #8b949e;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-details p {
  margin: 0;
}

.on-hold {
  color: #f85149;
}

.icon {
  margin-right: 8px;
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