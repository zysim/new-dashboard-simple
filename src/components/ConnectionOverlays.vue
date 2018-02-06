<template>

  <div id="connection-overlays">
    <div id="disconnected" class="alert alert-warning" role="alert" v-if="disconnected">
      Disconnected - refresh page when ROS is running to reconnect
    </div>
    <div id="connecting" class="alert alert-info" role="alert" v-if="connecting">
      Connecting...
    </div>
    <div id="connected" class="alert alert-success" role="alert" v-if="!(disconnected || connecting)">
      We're connected!
    </div>
  </div>

</template>

<script>
export default {
  props: {
    disconnected: {
      type: Boolean,
      default: false
    },
    connecting: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
