<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    const newPath = '/' + path;
    this.$router.replace({ path: newPath, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
