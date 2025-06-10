<template>
  <a href="https://cuca-de-llum.web.app" target="_blank">
    <v-img src="/cuca-de-llum-logo.png" class="logo" alt="Cuca de Llum logo" contain></v-img>
  </a>
  <h1 class="text-h4">Reserva tu estancia</h1>
  <h2 class="text-body-2">
    En el corazón de Amealco, Quéretaro, se encuentra Cuca de Llum, un lugar mágico donde la
    naturaleza y la tranquilidad se unen para ofrecerte una experiencia única.
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
  }

  @media (min-width: 960px) {
    .logo {
      width: 30%;
    }
  }
</style>
