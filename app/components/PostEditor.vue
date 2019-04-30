<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <StackLayout>
          <Label class="message" text="Editor" />
          <TextView v-model="content" />
          <Label class="message" text="Preview" />
          <HtmlView :html="md(content)" />
          <Button class="btn btn-primary btn-active" text="PUBLISH" @tap="onTapPublish" ></Button>
        </StackLayout>
    </Page>
</template>

<script >
  import { mapActions } from 'vuex'
  import snarkdown from 'snarkdown';
  import App from './App'
  export default {
    data() {
      return {
        content: '',
      }
    },
    props: {
      parent_id: {
        required: false,
        default: 0
      }
    },
    methods: {
      ...mapActions(['publishPost', 'loadPosts']),
      onTapPublish() {
        this.publishPost({parent_id: this.parent_id, content: this.content})
          .then(res => {
            this.loadPosts({offset: 0, limit: 100, parent_id: this.parent_id})
            this.$modal.close()
          })
      },
      md(md) {
        return snarkdown(md)
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
