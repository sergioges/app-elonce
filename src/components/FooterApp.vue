<script setup>
  const footerIcons = [
    {
      icon: 'mdi-whatsapp',
      url: 'https://api.whatsapp.com/send?phone=524423620391&text=Hola!%20Estoy%20interesad@%20en%20recibir%20más%20información%20de%20Cuca%20de%20Llum.'
    },
    {
      icon: 'mdi-mail',
      url: 'mailto:cucadellumcasarural@gmail.com'
    },
    {
      icon: 'mdi-instagram',
      url: 'https://www.instagram.com/cucadellumcasadecampo/'
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
      Aunque suene curioso, “Cuca de Llum” no es una expresión típica mexicana, ¡pero tiene una
      historia muy especial! En algunas zonas de habla catalana (Cataluña, España), “Cuca de llum”
      significa literalmente luciérnaga. Es una forma poética y tierna de referirse a ese pequeño
      insecto que brilla en la oscuridad. La palabra “llum” significa luz, y “cuca” puede referirse
      a un bichito.
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} —
      <strong>Cuca de Llum - Casa de Campo</strong>
    </div>
    <em class="reservame">
      Powered by:
      <a href="https://reservame-agenda-digital.web.app/" target="_blank">
        ReservaMe - Agenda Digital
      </a>
    </em>
  </v-footer>
</template>

<style lang="css" scoped>
  .custom-footer {
    background-color: #665745;
    color: white;
  }

  .reservame a {
    text-decoration: underline;
    color: #fff;
  }
</style>
