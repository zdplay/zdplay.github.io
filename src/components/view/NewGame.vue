<template>
  <v-app :class="{'dark-mode': isDarkMode}">
    <v-main class="game-container">
      <v-container class="fill-height d-flex flex-column justify-center align-center">
        <div class="title-card">
          <div class="game-title">{{ $vuetify.lang.t('$vuetify.info.title') }}</div>
          <v-card-actions class="justify-center">
            <v-btn icon @click="toggleLanguage">
              <v-icon>mdi-web</v-icon>
            </v-btn>
            <v-btn icon @click="toggleDarkMode">
              <v-icon>{{ isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </div>

        <v-card elevation="4" class="button-card">
          <v-btn class="game-button" color="primary" @click="startNewGame" elevation="8">
            <v-icon left>mdi-play</v-icon>
            {{ $vuetify.lang.t('$vuetify.gooboo.newGame') }}
          </v-btn>
          <v-btn class="game-button" color="secondary" elevation="8">
            <label for="gooboo-savefile-input">
              <v-icon left>mdi-upload</v-icon>
              {{ $vuetify.lang.t('$vuetify.gooboo.playedBefore.1') }}
            </label>
          </v-btn>
          <v-btn class="game-button" color="info" @click="showLoginDialog" elevation="8">
            <v-icon left>mdi-cloud</v-icon>
            {{ $vuetify.lang.t('$vuetify.gooboo.cloudlogin') }}
          </v-btn>
        </v-card>
      </v-container>

      <div v-if="loginDialog" class="custom-dialog-overlay">
        <div class="custom-dialog" :class="{'dark-mode': isDarkMode}">
          <div class="custom-dialog-title">{{ $vuetify.lang.t('$vuetify.gooboo.cloudlogin') }}</div>
          <div class="custom-dialog-content">
            <div class="custom-input-container">
              <label for="username">{{ $vuetify.lang.t('$vuetify.settings.general.clouduser.name') }}</label>
              <input type="text" id="username" v-model="username" class="custom-input">
            </div>
            <div class="custom-input-container">
              <label for="password">{{ $vuetify.lang.t('$vuetify.settings.general.cloudpwd.name') }}</label>
              <input type="password" id="password" v-model="password" class="custom-input">
            </div>
          </div>
          <div class="custom-dialog-actions">
            <v-btn color="primary" @click="loadCloudSave" elevation="2" rounded>{{ $vuetify.lang.t('$vuetify.gooboo.confirm') }}</v-btn>
            <v-btn color="grey lighten-1" @click="loginDialog = false" elevation="2" rounded>{{ $vuetify.lang.t('$vuetify.gooboo.cancel') }}</v-btn>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { loadLatestFileData } from '../../js/savefile';

export default {
  data() {
    return {
      loginDialog: false,
      username: '',
      password: '',
      languageList: ['zh', 'en', 'de'],
      currentLangIndex: 0
    }
  },
  computed: {
    isDarkMode: {
      get() {
        return this.$vuetify.theme.dark
      },
      set(value) {
        this.$vuetify.theme.dark = value
      }
    },
    currentLanguage: {
      get() {
        return this.$vuetify.lang.name
      },
      set(value) {
        this.$vuetify.lang.name = value
      }
    }
  },
  methods: {
    startNewGame() {
      this.$store.dispatch('system/updateSetting', {category: 'general', name: 'pause', value: false});
      this.$store.commit('system/resetAutosaveTimer');
      this.$store.commit('system/resetcloudAutosaveTimer');
      this.$store.commit('system/updateKey', {key: 'screen', value: 'mining'});
    },
    showLoginDialog() {
      this.loginDialog = true;
    },
    login() {
      this.loginDialog = false;
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    toggleLanguage() {
      this.currentLangIndex = (this.currentLangIndex + 1) % this.languageList.length;
      let newLang = this.languageList[this.currentLangIndex];
      this.$store.dispatch('system/updateSetting', {category: 'general', name: 'lang', value: newLang});
    },
    async loadCloudSave() {
      try {
        await loadLatestFileData(this.username, this.password);
      } catch (error) {
        console.error('loadClouderror:', error);
      }
    }
  }
}
</script>

<style scoped>
.game-container {
  background-color: #e0e0e0;
  transition: background-color 0.3s ease;
  padding: 20px;
  min-height: 100vh;
}

.dark-mode .game-container {
  background-color: #333;
}

.title-card {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-title {
  font-size: 3rem;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  transition: color 0.3s ease;
  text-align: center;
  margin-bottom: 0;
}

.dark-mode .game-title {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.button-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  padding: 20px;
}

.game-button {
  width: 100%;
  max-width: 280px;
  height: 50px;
  font-size: 1rem;
}

.hidden-file-input {
  display: none;
}

.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-dialog {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}

.custom-dialog.dark-mode {
  background-color: #424242;
  color: #fff;
}

.custom-dialog-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  transition: color 0.3s ease;
}

.custom-dialog.dark-mode .custom-dialog-title {
  color: #fff;
}

.custom-dialog-content {
  margin-bottom: 20px;
}

.custom-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.custom-input-container label {
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #555;
  transition: color 0.3s ease;
}

.custom-dialog.dark-mode .custom-input-container label {
  color: #ccc;
}

.custom-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  background-color: #fff;
  color: #333;
}

.custom-input:focus {
  outline: none;
  border-color: #64b5f6;
}

.custom-dialog.dark-mode .custom-input {
  background-color: #303030;
  color: #eee;
  border-color: #555;
}

.custom-dialog.dark-mode .custom-input:focus {
  border-color: #80cbc4;
}

.custom-dialog-actions {
  display: flex;
  justify-content: center;
}

.game-button label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: auto;
}
</style>
