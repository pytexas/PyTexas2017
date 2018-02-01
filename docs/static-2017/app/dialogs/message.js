function message_dialog(message, callback, opts) {
  var dialog = {
    template: "#tpl-dialogs-message",
    data() {
      opts = opts || {};

      return {
        message: message,
        title: opts.title || "Message",
        icon: opts.icon || "warning",
        ref: opts.ref || "msgdialog",
        title_class: opts.title_class || "msg"
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs[this.ref].open();
      });
    },
    methods: {
      close() {
        this.$refs[this.ref].close();
      },
      onClose() {
        this.$nextTick(() => {
          callback();
        });
      }
    }
  };

  return dialog;
}

export default message_dialog;
