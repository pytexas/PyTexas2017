import message_dialog from './message';

function error_dialog (message, callback) {
  return message_dialog(message, callback, {
    title: 'Error',
    icon: 'error_outline',
    ref: 'errdialog',
    title_class: 'error'
  });
}

export default error_dialog;
