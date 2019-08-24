
import bootbox from 'bootbox'

import './messagebox.css'

export function alert(title, message, dismissed = null, okCaption = 'OK', onEscape = true) {
  bootbox.confirm({
    title: title,
    message: message,
    className: "draftpod-bootbox-dialog",
    closeButton: false,
    onEscape: onEscape,
    size: 'large',
    buttons: {
      confirm: {
        label: okCaption,
        className: 'btn-primary'
      },
      cancel: {
        label: 'Cancel',
        className: 'hidden-button'
      }
    },
    callback: () => {
      if (dismissed)
        dismissed();
    }
  });
}

export function confirm(title, message, confirmed, cancelled) {

  bootbox.confirm({

    title: title,

    message: message,
    
    className: "draftpod-bootbox-dialog",

    closeButton: false,

    size: 'large',

    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-primary btn-success'
      },
      cancel: {
        label: 'No',
        className: 'btn-secondary'
      }
    },
  
    callback: (result) => {
      if (result && confirmed)
        confirmed();
      else if (!result && cancelled)
        cancelled();
    }
  });
}

export function prompt(title, callback) {

  bootbox.prompt({

    title: title,
    
    className: "draftpod-bootbox-dialog",

    closeButton: false,

    size: 'large',
  
    callback
  });
}




