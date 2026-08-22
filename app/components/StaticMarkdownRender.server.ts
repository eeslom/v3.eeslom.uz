export default defineComponent({
  props: {
    collection: { type: String as () => 'page' | 'blog', required: true },
    path: { type: String, required: true },
  },
  async setup(props) {
    return () => h(queryCollection(props.collection).path(props.path).first())
  },
})
