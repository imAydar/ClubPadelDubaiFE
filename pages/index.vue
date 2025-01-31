<script setup>
const events = [
  { id: 1, name: "Rally Club", date: "Saturday", time: "13:00", location: "Rally Club" },
  { id: 2, name: "Padel Art - Saturday", date: "Saturday", time: "13:00", location: "Padel Art" },
  { id: 3, name: "Padel Art - Sunday", date: "Sunday", time: "13:00", location: "Padel Art" }
];
</script>

<template>
  <div class="container">
    <h1>Padel Events</h1>
    
    <div class="event-list">
      <div v-for="event in events" :key="event.id" class="event-card">
        <h2>{{ event.name }}</h2>
        <p><strong>Date:</strong> {{ event.date }} at {{ event.time }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <NuxtLink :to="`/event/${event.id}`" class="button">View Event</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #ff9f1c;
}

.event-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.event-card {
  background: #282a36;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #44475a;
  text-align: center;
  width: 250px;
}

.button {
  display: inline-block;
  padding: 10px;
  background: #ff9f1c;
  color: black;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 10px;
}

.button:hover {
  background: #ff3f34;
}
</style>
