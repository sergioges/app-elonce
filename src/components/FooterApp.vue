<script setup>
  const footerIcons = [
    {
      icon: 'mdi-whatsapp',
      url: 'https://api.whatsapp.com/send?phone=5214421128615&text=Hola!%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20R%C3%BAstico.'
    },
    {
      icon: 'mdi-facebook',
      url: 'https://www.facebook.com/RusticoElOnce'
    },
    {
      icon: 'mdi-instagram',
      url: 'https://www.instagram.com/rustico_el_once/?hl=es-la'
    }
  ]

  function openLink(url) {
    window.open(url, '_blank')
  }
</script>

<template>
  <v-footer class="custom-footer text-center d-flex flex-column ga-2 py-4">
    <div class="d-flex ga-3">
      <v-btn
        v-for="item in footerIcons"
        :key="item.icon"
        :icon="item.icon"
        density="comfortable"
        variant="text"
        @click="openLink(item.url)"
      ></v-btn>
    </div>

    <v-divider class="my-2" thickness="2" width="50"></v-divider>

    <div class="text-caption font-weight-regular opacity-60">
      Aunque suene a nombre de novela, Rústico El Once es un rincón encantador en Amealco donde la
      naturaleza, el descanso y la calidez se encuentran. Con sus cabañas acogedoras entre árboles y
      cielos estrellados, es el lugar perfecto para desconectar, disfrutar de fogatas, desayunos
      caseros y ese toque especial que solo tienen los sitios con alma. Más que un hospedaje, es una
      experiencia para recordar.
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} —
      <strong>Rústico El Once - Finca Campestre</strong>
    </div>
    <em class="reservame">
      Powered by:
      <v-btn
        prepend-icon="mdi-calendar-check-outline"
        rounded="lg"
        variant="outlined"
        color="white"
        size="small"
        class="button"
        @click="openLink('https://reservame-agenda-digital.com/')"
      >
        ReservaMe
      </v-btn>
    </em>
  </v-footer>
</template>

<style lang="css" scoped>
  .custom-footer {
    background-color: #2f5349;
    color: #fff;
  }

  .reservame {
    font-size: 14px;
    color: #fff;
  }

  .button {
    text-transform: none !important;
  }

  .button:hover {
    color: #fff !important;
    border-color: #fff !important;
  }
</style>
