<template>
  <a href="https://rusticoelonce.com/" target="_blank">
    <v-img
      src="/Rustico-El-Once-Finca-Campestre.svg"
      class="logo"
      alt="Rústico El Once - Finca Campestre logo"
      contain
    ></v-img>
  </a>
  <h1 class="text-h4">Reserva tu estancia</h1>
  <h2 class="text-body-2">
    Finca campestre en Amealco. Un rincón de descanso para familias, grupos y eventos. Hoespedaje
    único.
  </h2>
</template>

<style lang="css" scoped>
  @font-face {
    font-family: 'CelciusFlower';
    src: url('/fonts/celcius_flower.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Cocomat';
    src: url('/fonts/cocomat.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }

  h1 {
    font-family: 'CelciusFlower', sans-serif;
  }

  h2 {
    font-family: 'Cocomat', sans-serif;
  }

  .logo {
    width: 80%;
    height: auto;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 20px;
    background-color: #2f5349;
  }

  @media (min-width: 960px) {
    .logo {
      width: 30%;
    }
  }
</style>
