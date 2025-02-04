<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { MainButton, useWebAppPopup, useMiniApp } from 'vue-tg';
import { useApi } from '~/composables/useApi';

const { showAlert } = useWebAppPopup();
const { initDataUnsafe } = useMiniApp();
const route = useRoute();
const { getEventById, registerForEvent, confirmParticipation, removeParticipant } = useApi();

const eventId = ref(route.params.id);
const event = ref(null);
const userName = ref(initDataUnsafe?.user?.username || '');
const isLoading = ref(false);
const errorMessage = ref('');

// Fetch event details
onMounted(async () => {
  try {
    event.value = await getEventById(eventId.value);
  } catch (error) {
    errorMessage.value = 'Failed to load event details.';
    console.error(error);
  }
});

// Register participant
const registerParticipant = async () => {
  if (!userName.value.trim()) {
    showAlert('Please enter your name!');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    event.value = await registerForEvent(eventId.value, userName.value);
    showAlert('Registration successful!');
  } catch (error) {
    errorMessage.value = error.message || 'Failed to register.';
    console.error('Error registering:', error);
  } finally {
    isLoading.value = false;
  }
};

// Confirm/unconfirm participation
const handleConfirm = async (participantId, confirm) => {
  try {
    event.value = await confirmParticipation(eventId.value, participantId, confirm);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to confirm participation.';
    console.error('Error confirming participation:', error);
  }
};

// Remove participant
const handleRemove = async (participantId) => {
  try {
    event.value = await removeParticipant(eventId.value, participantId);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to remove participant.';
    console.error('Error removing participant:', error);
  }
};
</script>

<template>
  <MainButton text="Open alert" @click="() => showAlert(userName + 'asd')" />
  <div class="container" v-if="event">
    <div class="card">
      <h1>{{ event.name }}</h1>
      <p class="details"><strong>Date:</strong> {{ event.date }} at {{ event.time }}</p>
      <p class="details"><strong>Location:</strong> {{ event.location }}</p>

      <!-- User Input -->
      <input v-model="userName" type="text" placeholder="Enter your name" class="name-input" />

      <button class="register-button" @click="registerParticipant" :disabled="isLoading">
        {{ isLoading ? 'Joining...' : 'Join Event' }}
      </button>

      <!-- Participants -->
      <div class="participants">
        <h2>Participants ({{ event.participants.length }}/5)</h2>
        <ul>
          <li v-for="participant in event.participants" :key="participant.id">
            <span class="player-info">
              {{ participant.name }}
              <span v-if="participant.confirmed" class="confirmed">✅</span>
            </span>
            <div class="actions">
              <button
                v-if="!participant.confirmed"
                @click="handleConfirm(participant.id, true)"
                class="confirm-button"
              >
                ✅ Confirm
              </button>
              <button
                v-if="participant.confirmed"
                @click="handleConfirm(participant.id, false)"
                class="unconfirm-button"
              >
                ❌ Unconfirm
              </button>
              <button @click="handleRemove(participant.id)" class="delete-button">🗑 Remove</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Waitlist -->
      <div class="waitlist" v-if="event.waitlist.length > 0">
        <h2>Waiting List ({{ event.waitlist.length }})</h2>
        <ul>
          <li v-for="participant in event.waitlist" :key="participant.id">
            <span>{{ participant.userName }}</span>
            <button @click="handleRemove(participant.id)" class="delete-button">🗑 Remove</button>
          </li>
        </ul>
      </div>

      <NuxtLink to="/" class="back-button">⬅ Back to Events</NuxtLink>
    </div>
  </div>

  <div v-else class="container">
    <h1>Event Not Found</h1>
    <NuxtLink to="/" class="back-button">⬅ Back to Events</NuxtLink>
  </div>
</template>
<style src="./event.css"></style>