
import bootbox from 'bootbox'

import './messagebox.css'

export function confirm(message, confirmed, cancelled) {

  bootbox.confirm({

    message: message,
    
    className: "mtgdraft-bootbox-dialog",

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

