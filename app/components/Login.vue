<template>
    <Page>
        <ActionBar title="Login"/>
        <StackLayout>
          <TextField v-model="username" hint="Username"/>
          <TextField v-model="password" hint="password"/>
          <Button class="btn btn-primary btn-active" text="LOGIN" @tap="onTap" ></Button>
          <Label class="message" :text="'Login Failed: ' + loginFailed" />
          <Label class="message" :text="isLogged" />
        </StackLayout>
    </Page>
</template>

<script >
  import { mapGetters, mapActions } from 'vuex'
  import App from './App'

  export default {
    data() {
      return {
        loginFailed: false,
        username: '',
        password: ''
      }
    },
    mounted() {
      this.checkLogin()
        .then(res => {
          if (res) {
            this.$navigateTo(App, {
              clearHistory: true,
              props: {
                parent_id: 0,
              }
            })
          }
        })
    },
    computed: {
      ...mapGetters([
        'isLogged'
      ])
    },
    methods: {
      ...mapActions(['login', 'checkLogin']),
      async onTap() {
        this.loginFailed = !(await this.login({ username: this.username, password: this.password}))
        if (!this.loginFailed) {
          this.$navigateTo(App, {
            clearHistory: true
          })
        }
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
