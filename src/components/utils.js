import './styles.css'

import bootbox from 'bootbox'

export function confirm(message, confirmed, cancelled) {

  bootbox.confirm({

    message: message,
    
    className: "mtgdraft-bootbox-dialog",

    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-secondary'
      },
      cancel: {
        label: 'No',
        className: 'btn-primary'
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