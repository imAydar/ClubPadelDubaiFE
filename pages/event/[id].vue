<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { MainButton, useWebAppPopup, useMiniApp } from 'vue-tg'

const { showAlert } = useWebAppPopup()
const {initDataUnsafe} = useMiniApp();
//const { userName } = initDataUnsafe()

const route = useRoute();
const eventId = ref(parseInt(route.params.id));

const events = [
  { id: 1, name: "Rally Club", date: "Saturday", time: "13:00", location: "Rally Club" },
  { id: 2, name: "Padel Art - Saturday", date: "Saturday", time: "13:00", location: "Padel Art" },
  { id: 3, name: "Padel Art - Sunday", date: "Sunday", time: "13:00", location: "Padel Art" }
];

// Find event by ID
const event = computed(() => events.find(e => e.id === eventId.value));

// Participants & Waiting List
const participants = ref([]);  // Limit: 5
const waitlist = ref([]);  // Limit: 20
let userName2 = ref("");

const registerParticipant = () => {
  if (!userName.value.trim()) {
    alert("Please enter your name!");
    return;
  }

  if (participants.value.length < 5) {
    participants.value.push({ name: userName.value, confirmed: false });
  } else if (waitlist.value.length < 20) {
    waitlist.value.push(userName.value);
  } else {
    alert("Event & waitlist are full!");
  }

  userName.value = "";
};

const confirmArrival = (index) => {
  participants.value[index].confirmed = true;
};

const unconfirmArrival = (index) => {
  participants.value[index].confirmed = false;
};

const removeParticipant = (index) => {
  participants.value.splice(index, 1);
  if (waitlist.value.length > 0) {
    const nextPerson = waitlist.value.shift();
    participants.value.push({ name: nextPerson, confirmed: false });
  }
};

const removeFromWaitlist = (index) => {
  waitlist.value.splice(index, 1);
};

onMounted(() => {
  userName2 = initDataUnsafe?.user?.userName;
  console.log(initDataUnsafe);
});
</script>

<template>
  <MainButton text="Open alert" @click="() => showAlert(userName + 'asd')" />
  <div class="container" v-if="event">
    <div class="card">
      <h1>{{ event.name }}</h1>
      <p class="details"><strong>1Date:</strong> {{ event.date }} at {{ event.time }}</p>
      <p class="details"><strong>Location:</strong> {{ event.location }}</p>
      {{ userName }}
      <!-- User Input -->
      <input v-model="userName" type="text" placeholder="Enter your name" class="name-input" />

      <button class="register-button" @click="registerParticipant">Join Event</button>

      <!-- Participants -->
      <div class="participants">
        <h2>Participants ({{ participants.length }}/5)</h2>
        <ul>
          <li v-for="(player, index) in participants" :key="index">
            <span class="player-info">
              {{ index + 1 }}. {{ player.name }}
              <span v-if="player.confirmed" class="confirmed">✅</span>
            </span>
            <div class="actions">
              <button v-if="!player.confirmed" @click="confirmArrival(index)" class="confirm-button">
                ✅ Confirm
              </button>
              <button v-if="player.confirmed" @click="unconfirmArrival(index)" class="unconfirm-button">
                ❌ Unconfirm
              </button>
              <button @click="removeParticipant(index)" class="delete-button">🗑 Remove</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Waitlist -->
      <div class="waitlist">
        <h2>Waiting List ({{ waitlist.length }}/20)</h2>
        <ul>
          <li v-for="(player, index) in waitlist" :key="index">
            <span>{{ index + 1 }}. {{ player }}</span>
            <button @click="removeFromWaitlist(index)" class="delete-button">🗑 Remove</button>
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

<style>
/* General Page Styles */
body {
  font-family: "Inter", sans-serif;
  background-color: #0d1117;
  color: #c9d1d9;
  margin: 0;
  padding: 20px;
}

/* Centered Container */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Card Layout */
.card {
  background: #161b22;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 420px;
  width: 100%;
  transition: all 0.3s;
}

.card:hover {
  transform: scale(1.02);
}

/* Headings */
h1 {
  font-size: 26px;
  color: #58a6ff;
  margin-bottom: 10px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Event Details */
.details {
  font-size: 16px;
  color: #8b949e;
  margin: 4px 0;
}

/* Input Field */
.name-input {
  width: 90%;
  padding: 12px;
  font-size: 16px;
  margin: 15px auto;
  border: 2px solid #58a6ff;
  border-radius: 8px;
  background: #21262d;
  color: white;
  text-align: center;
  display: block;
}

/* Buttons */
.register-button {
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

.register-button:hover {
  background: linear-gradient(135deg, #1f6feb, #58a6ff);
  transform: scale(1.05);
}

.confirm-button,
.unconfirm-button,
.delete-button {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  margin-left: 6px;
}

.confirm-button {
  background: #4caf50;
}

.confirm-button:hover {
  background: #388e3c;
}

.unconfirm-button {
  background: #ff9800;
}

.unconfirm-button:hover {
  background: #f57c00;
}

.delete-button {
  background: #ff5555;
}

.delete-button:hover {
  background: #d32f2f;
}

/* Participants List */
.participants,
.waitlist {
  margin-top: 20px;
  padding: 15px;
  background: #21262d;
  border-radius: 10px;
}

.participants ul,
.waitlist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.participants li,
.waitlist li {
  font-size: 16px;
  padding: 5px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.participants li:last-child,
.waitlist li:last-child {
  border-bottom: none;
}

/* Back Button */
.back-button {
  display: block;
  margin-top: 15px;
  padding: 10px;
  background: #30363d;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s;
}

.back-button:hover {
  background: #ff5555;
}
</style>
