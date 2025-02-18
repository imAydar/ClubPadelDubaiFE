<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useMiniApp } from 'vue-tg';

const { initData } = useMiniApp();
const { events, fetchEvents, createEvent, auth } = useApi();
const router = useRouter();
const hash = ref(initData?.hash);

// Form data for creating a new event
const newEvent = ref({
  name: "",
  date: "",
  time: "",
  location: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  console.log("Fetching events..."); // Debugging
  await fetchEvents();
  console.log("Events fetched:", events.value); // Debugging
  await auth(initData);
});

const goToEvent = (eventId) => {
  console.log(hash);
  router.push(`/event/${eventId}`);
};

const handleCreateEvent = async () => {
  if (
    !newEvent.value.name ||
    !newEvent.value.date ||
    !newEvent.value.time ||
    !newEvent.value.location
  ) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await createEvent(newEvent.value);
    alert("Event created successfully!");
    newEvent.value = { name: "", date: "", time: "", location: "" }; // Reset form
    await fetchEvents(); // Refresh the events list
  } catch (error) {
    errorMessage.value = error.message || "Failed to create event. Please try again.";
    console.error("Error creating event:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Padel Events</h1>
      <p>Create or join an event.</p>

      <!-- Create Event Form -->
      <div class="create-event-form">
        <h2>Create New Event</h2>
        <input v-model="newEvent.name" class="input-field" placeholder="Event Name" />
        <input v-model="newEvent.date" class="input-field" type="date" placeholder="Date" />
        <input v-model="newEvent.time" class="input-field" type="time" placeholder="Time" />
        <input v-model="newEvent.location" class="input-field" placeholder="Location" />
        <button @click="handleCreateEvent" class="create-button" :disabled="isLoading">
          {{ isLoading ? "Creating..." : "Create Event" }}
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <!-- Events List -->
      <div class="events-list">
        <h2>Upcoming Events</h2>
        <div v-if="events.length === 0">No events available.</div>
        <div
          v-for="event in events"
          :key="event.id"
          class="event-item"
          @click="goToEvent(event.id)"
        >
          <h2>{{ event.name }}</h2>
          <p><strong>Date:</strong> {{ event.date }} at {{ event.time }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  background: #161b22;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  width: 100%;
  transition: all 0.3s;
  color:white;
}

.card:hover {
  transform: scale(1.02);
}

.create-event-form {
  margin-bottom: 20px;
}

.input-field {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #444;
  border-radius: 8px;
  background: #21262d;
  color: white;
  font-size: 16px;
}

.create-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: linear-gradient(135deg, #58a6ff, #1f6feb);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.create-button:hover {
  background: linear-gradient(135deg, #1f6feb, #58a6ff);
  transform: scale(1.05);
}

.error-message {
  color: #ff5555;
  margin-top: 10px;
}

.events-list {
  margin-top: 20px;
}

.event-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 8px;
  cursor: pointer;
}

.event-item:hover {
  background: #21262d;
}
</style>