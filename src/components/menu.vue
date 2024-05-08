<template>
  <div class="menu">
    <div class="card-container">
      <div class="card" v-for="card in leftCards" :key="card.id">
        <div class="card-content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="card-container right">
      <div class="card" v-for="card in rightCards" :key="card.id">
        <div class="card-content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import leftCards from "@components/"
export dleftCardst {
  data() {
    return {
      leftCards: [
        { id: 1, title: 'Left Card 1', description: 'Description for left card 1.' },
        { id: 2, title: 'Left Card 2', description: 'Description for left card 2.' },
        { id: 3, title: 'Left Card 3', description: 'Description for left card 3.' }
      ],
      rightCards: [
        { id: 4, title: 'Right Card 1', description: 'Description for right card 1.' },
        { id: 5, title: 'Right Card 2', description: 'Description for right card 2.' },
        { id: 6, title: 'Right Card 3', description: 'Description for right card 3.' }
      ]
    }
  }
}
</script>
  
<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
}

.card-container {
  flex-basis: 48%;
}

.card {
  background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent white */
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-content h3 {
  margin: 0 0 10px 0;
}

.card-content p {
  margin: 0;
}

.right .card {
  /* Additional styles for right cards if needed */
}
</style>
