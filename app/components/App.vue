<template>
    <Page>
        <ActionBar title="Redpill">
          <ActionItem
            @tap="reloadPosts"
            ios.position="left"
            android.position="actionBar" >
              <Button class="btn" text="RELOAD" ></Button>
          </ActionItem>
          <ActionItem
            @tap="onTapLogout"
            ios.systemIcon="1" ios.position="left"
            android.position="actionBar" >
              <Button class="btn" text="LOGOUT" ></Button>
          </ActionItem>
          <ActionItem
            v-if="parent_id > 0"
            @tap="onTapBack"
            ios.systemIcon="1" ios.position="left"
            android.position="actionBar" >
              <Button class="btn" text="BACK" ></Button>
          </ActionItem>
        </ActionBar>
        <StackLayout>
          <Label v-if="parent_id === 0" class="header" text="Welcome to Redpill, these are the root posts, all discussions start here." />
          <HtmlView v-if="parent_id > 0" class="header-content" :html="md(parentPost.content)" />
          <GridLayout class="header-bottom" columns="*, *" rows="auto">
            <Button row="0" col="0" class="btn" text="READ" @tap="onTapRead(parentPost)" ></Button>
            <Button row="0" col="1" class="btn" text="WRITE POST" @tap="onTapWrite" ></Button>
          </GridLayout>
          <Label class="no-posts" v-if="postsList[parent_id] === undefined || (postsList[parent_id] && postsList[parent_id].length === 0)" text="There are no posts here..." />
          <ListView for="post in (postsList[parent_id] ? postsList[parent_id]  : [] )" class="posts-list" separatorColor="transparent">
            <v-template>
              <StackLayout>
                <GridLayout columns="*, *, *" rows="auto, 100, auto, auto" class="post-box">
                  <Label row="0" col="0" colSpan="3" class="author" :text="`@${post.email}`" />
                  <HtmlView class="content" row="1" col="0" colSpan="3" :html="md(post.content)" />
                  <Label row="2" col="0" colSpan="3" class="reactions" :text="`🔴 ${post.upvotes} 🔵 ${post.downvotes}`" />
                  <Button class="btn" row="3" col="0" v-if="!post.my_vote" text="REACT" @tap="() => onTapReaction(post.parent_id, post.post_id)" ></Button>
                  <Button class="btn" row="3" col="0" v-if="post.my_vote" :text="`REMOVE ${post.my_vote === 1 ? '🔴': '🔵'}`" @tap="() => onTapDeleteReaction(post.parent_id, post.post_id, post.my_vote)" ></Button>
                  <Button class="btn" row="3" col="1" text="READ" @tap="onTapRead(post)" ></Button>
                  <Button class="btn" row="3" col="2" :text="`${post.subposts} POSTS `" @tap="() => openPost(post.post_id)" ></Button>
                </GridLayout>
              </StackLayout>
            </v-template>
          </ListView>
        </StackLayout>
    </Page>
</template>

<script >
  import { mapActions, mapGetters } from 'vuex'
  import Login from './Login'
  import PostEditor from './PostEditor'
  import PostPreview from './PostPreview'
  import App from './App'
  const Markdown = require('markdown-it')
  const markdownStyle = require('markdown-it-style')


  const { alert, action } = require("tns-core-modules/ui/dialogs");

  export default {
    props: {
      parent_id: {
        required: false,
        default: 0
      },
      parentPost: {
        required: false,
        default: {}
      }
    },
    data() {
      return {}
    },
    mounted() {
      this.reloadPosts()
    },
    computed: {
      ...mapGetters([
        'postsList'
      ])
    },
    methods: {
      ...mapActions(['logout', 'loadPosts', 'react', 'updatePost', 'removeReaction']),
      reloadPosts() {
        this.loadPosts({offset: 0, limit: 100, parent_id: this.parent_id})
      },
      onTapBack() {
        this.$navigateBack()
      },
      openPost(post_id) {
        this.$navigateTo(App, {
          props: {
            parent_id: post_id,
            parentPost: this.postsList[this.parent_id].find(p => p.post_id === post_id)
          },
          transition: {
            name: 'slideLeft'
          }
        })
        this.loadPosts({offset: 0, limit: 100, parent_id: post_id})
      },
      onTapLogout() {
        this.logout()
          .then(() => {
            this.$navigateTo(Login, {
              clearHistory: true
            })
          })
      },
      onTapWrite() {
        this.$showModal(PostEditor, {
          fullscreen: true,
          props: {
            parent_id: this.parent_id,
          }
        })
      },
      onTapRead(postToPreview) {
        this.$showModal(PostPreview, {
          fullscreen: true,
          props: { post: postToPreview }
        })
      },
      onTapReaction(parent_id, post_id) {
        action("Reactions", "Cancel", ["🔴", "🔵"])
          .then(result => {
            let reaction_type
            switch (result) {
              case '🔴': reaction_type = 1; break;
              case '🔵': reaction_type = 2; break;
              default:
            }
            if (reaction_type) {
              this.react({post_id, reaction_type}).then(res => {
                if (res) {
                  let reactions = {}
                  const reactionsCountName = {
                    1: 'upvotes',
                    2: 'downvotes'
                  }
                  reactions[reactionsCountName[reaction_type]] = '+'
                  this.updatePost({ parent_id, post_id, my_vote: reaction_type, reactions })
                } else {
                  alert('You already voted!')
                }
              })
            }
          });
      },
      onTapDeleteReaction(parent_id, post_id, my_vote) {
        this.removeReaction({post_id}).then(res => {
          if (res) {
            let reactions = {}
            const reactionsCountName = {
              1: 'upvotes',
              2: 'downvotes'
            }
            reactions[reactionsCountName[my_vote]] = '-'
            this.updatePost({ parent_id, post_id, my_vote: 0, reactions })
          } else {
            alert('Error in removing vote!')
          }
        })
      },
      md(mdTxt) {
        var md = new Markdown()
        md.use(markdownStyle, {
          'p': 'color:#ffffff;',
          'li': 'color:#ffffff;',
        })
        let html = md.render(mdTxt)
        html = html.split('<h1>').join('<h1><font color="#ffffff">')
        html = html.split('</h1>').join('</font></h1>')
        html = html.split('<h2>').join('<h2><font color="#ffffff">')
        html = html.split('</h2>').join('</font></h2>')
        html = html.split('<h3>').join('<h3><font color="#ffffff">')
        html = html.split('</h3>').join('</font></h3>')
        return html
      }
    }
  }
</script>

<style scoped>

  ActionItem {
    color: #ffffff;
  }
  
  Page {
    background-color: #000000;
  }

  ActionBar {
    background-color: #000000;
    color: #ffffff;
  }

  .no-posts {
    margin: 20;
    font-size: 20;
    text-align: center;
    color: #ffffff;
  }

  .header {
    color: #ffffff;
    font-weight: 800;
    margin-top: 10;
    margin-bottom: 10;
    padding: 10;
  }

  .header-content {
    height: 80
  }

  .header-bottom {
    border-bottom-color: #ffffff;
    border-bottom-width: 2;
    padding-bottom: 10;
    margin-bottom: 10;
  }

  .btn {
    border-radius: 50%;
    background-color: transparent;
    border-color: #ffffff;
    border-width: 2;
    color: #ffffff;
    margin: 10;
  }

  .post-box {
    padding: 10;
    background: #000000;
    color: white;
    border-bottom-width: 1;
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .author {
    font-size: 18;
    font-weight: 800;
    text-align: left;
    margin-bottom: 10;
    color: #ffffff;
    margin-left: 10;
  }

  .content {
    margin-left: 10;
  }

  .reactions {
    margin-bottom: 10;
    text-align: left;
    font-size: 15;
    margin-left: 10;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 10;
    color: #333333;
  }
</style>
