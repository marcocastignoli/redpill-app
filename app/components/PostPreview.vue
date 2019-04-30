<template>
    <Page>
        <ScrollView>
          <StackLayout class="Page">
            <Button class="btn" text="CLOSE" @tap="close"></Button>
            <Label v-if="post.post_id" class="author" :text="`@${post.email}`" />
            <HtmlView v-if="post.post_id" :html="md(post.content)" />
            <HtmlView v-if="post.post_id === undefined" :html="md(`
## Crea eventi!
Con redpill creare momenti per divertirsi insieme diventa più facile. Le possibilità sono infinite: magari ti mancano due persone per il calcetto, hai voglia di studiare in compagnia, oppure vuoi organizzare una partita a risiko.  
Redpill ti offre la possibilità di staccarti dagli schermi digitali, per dedicarti al divertimento vero, ti aspettiamo.

## Ricerca eventi
Non sai cosa fare? Si sta avvicinando una serata social network e noia? Cerca eventi vicino a te con redpill, li trovi già divisi in categorie, così ti è più facile scegliere cosa vuoi vuoi fare!

## Crea eventi!
Con redpill creare momenti per divertirsi insieme diventa più facile. Le possibilità sono infinite: magari ti mancano due persone per il calcetto, hai voglia di studiare in compagnia, oppure vuoi organizzare una partita a risiko.  
Redpill ti offre la possibilità di staccarti dagli schermi digitali, per dedicarti al divertimento vero, ti aspettiamo.

## Ricerca eventi
Non sai cosa fare? Si sta avvicinando una serata social network e noia? Cerca eventi vicino a te con redpill, li trovi già divisi in categorie, così ti è più facile scegliere cosa vuoi vuoi fare!

## Crea eventi!
Con redpill creare momenti per divertirsi insieme diventa più facile. Le possibilità sono infinite: magari ti mancano due persone per il calcetto, hai voglia di studiare in compagnia, oppure vuoi organizzare una partita a risiko.  
Redpill ti offre la possibilità di staccarti dagli schermi digitali, per dedicarti al divertimento vero, ti aspettiamo.

## Ricerca eventi
Non sai cosa fare? Si sta avvicinando una serata social network e noia? Cerca eventi vicino a te con redpill, li trovi già divisi in categorie, così ti è più facile scegliere cosa vuoi vuoi fare!

## Crea eventi!
Con redpill creare momenti per divertirsi insieme diventa più facile. Le possibilità sono infinite: magari ti mancano due persone per il calcetto, hai voglia di studiare in compagnia, oppure vuoi organizzare una partita a risiko.  
Redpill ti offre la possibilità di staccarti dagli schermi digitali, per dedicarti al divertimento vero, ti aspettiamo.

## Ricerca eventi
Non sai cosa fare? Si sta avvicinando una serata social network e noia? Cerca eventi vicino a te con redpill, li trovi già divisi in categorie, così ti è più facile scegliere cosa vuoi vuoi fare!

## Crea eventi!
Con redpill creare momenti per divertirsi insieme diventa più facile. Le possibilità sono infinite: magari ti mancano due persone per il calcetto, hai voglia di studiare in compagnia, oppure vuoi organizzare una partita a risiko.  
Redpill ti offre la possibilità di staccarti dagli schermi digitali, per dedicarti al divertimento vero, ti aspettiamo.

## Ricerca eventi
Non sai cosa fare? Si sta avvicinando una serata social network e noia? Cerca eventi vicino a te con redpill, li trovi già divisi in categorie, così ti è più facile scegliere cosa vuoi vuoi fare!

            `)" />
          </StackLayout>
        </ScrollView>
    </Page>
</template>

<script >
  const Markdown = require('markdown-it')
  const markdownStyle = require('markdown-it-style')

  export default {
    data() {
      return {}
    },
    props: {
      post: {
        required: false
      }
    },
    methods: {
      close() {
        this.$modal.close()
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

  .btn {
    border-radius: 50%;
    background-color: transparent;
    border-color: #ffffff;
    border-width: 2;
    color: #ffffff;
    margin: 10;
  }

  .Page {
    background-color: #000000;
  }

  ActionBar {
      background-color: #53ba82;
      color: #ffffff;
  }

  .author {
    color: #ffffff;
  }

  .header {
    color: #ffffff;
  }

  .message {
      vertical-align: center;
      text-align: center;
      font-size: 20;
      color: #333333;
  }
</style>
