const CONTACT_TABLE = '.contacts-list'
const CONTACT_FORM = '.contacts-form'
const CONTACT_NAME = '.name'
const CONTACT_PHONE = '.phone'
const BUTTON_SAVE = '.button-save'
const BUTTON_CANCEL = '.button-cancel'

let Contacts = {
  index: window.localStorage.getItem('Contacts:index'),
  contactsList: document.querySelector(CONTACT_TABLE),
  contactsForm: document.querySelector(CONTACT_FORM),
  contactsName: document.querySelector(CONTACT_NAME),
  contactsPhone: document.querySelector(CONTACT_PHONE),
  buttonSave: document.querySelector(BUTTON_SAVE),
  buttonCancel: document.querySelector(BUTTON_CANCEL),

  initialize: function () {
    if (!Contacts.index) {
      window.localStorage.setItem('Contacts:index', Contacts.index = 1)
    };

    Contacts.contactsForm.reset()

    Contacts.buttonCancel.addEventListener('click', function (event) {
      Contacts.contactsForm.reset()
      Contacts.contactsForm.id_entry.value = 0
    }, true)

    Contacts.contactsForm.addEventListener('submit', function (event) {
      let entry = {
        id: parseInt(this.id_entry.value),
        name: this.name.value,
        phone: this.phone.value
      }

      if (Contacts.contactsName.value && Contacts.contactsPhone.value) {
        if (entry.id === 0) {
          Contacts.itemAdd(entry)
          Contacts.contactAdd(entry)
        } else {
          Contacts.itemEdit(entry)
          Contacts.contactEdit(entry)
        }
      } else {
        alert('Please feel in all the fields')
      }

      this.reset()
      this.id_entry.value = 0
      event.preventDefault()
    }, true)

    if (window.localStorage.length - 1) {
      let contactsArray = []
      let i
      let key

      for (i = 0; i < window.localStorage.length; i++) {
        key = window.localStorage.key(i)
        if (/Contacts:\d+/.test(key)) {
          contactsArray.push(JSON.parse(window.localStorage.getItem(key)))
        }
      }

      if (contactsArray.length) {
        contactsArray
          .sort(function (a, b) {
            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0)
          })
          .forEach(Contacts.contactAdd)
      }
    };

    Contacts.contactsList.addEventListener('click', function (event) {
      let action = event.target.getAttribute('data-action')
      if (/edit|remove/.test(action)) {
        let entry = JSON.parse(window.localStorage.getItem('Contacts:' + event.target.getAttribute('data-id')))
        if (action === 'edit') {
          Contacts.contactsForm.name.value = entry.name
          Contacts.contactsForm.phone.value = entry.phone
          Contacts.contactsForm.id_entry.value = entry.id
        } else if (action === 'remove') {
          if (confirm('Do you want to remove "' + entry.name + '" from contacts?')) {
            Contacts.itemRemove(entry)
            Contacts.contactRemove(entry)
          }
        }
        event.preventDefault()
      }
    }, true)
  },

  itemAdd: function (entry) {
    entry.id = Contacts.index
    window.localStorage.setItem('Contacts:index', ++Contacts.index)
    window.localStorage.setItem('Contacts:' + entry.id, JSON.stringify(entry))
  },

  itemEdit: function (entry) {
    window.localStorage.setItem('Contacts:' + entry.id, JSON.stringify(entry))
  },

  itemRemove: function (entry) {
    window.localStorage.removeItem('Contacts:' + entry.id)
  },

  contactAdd: function (entry) {
    let $tr = document.createElement('tr')
    let $td
    let key
    for (key in entry) {
      if (entry.hasOwnProperty(key)) {
        $td = document.createElement('td')
        if (key === 'phone') {
          $td.innerHTML = `<span>${key}</span><a href="tel:${entry[key]}">${entry[key]}</a>`
        } else {
          $td.innerHTML = `<span>${key}</span>${entry[key]}`
        }
        $tr.appendChild($td)
      }
    }
    $td = document.createElement('td')
    $td.innerHTML = `<a class="btn-edit" data-action="edit" data-id="${entry.id}">Edit</a> <a class="btn-remove" data-action="remove" data-id="${entry.id}">Remove</a>`
    $tr.appendChild($td)
    $td.classList.add('actions')
    $tr.setAttribute('id', 'entry-' + entry.id)
    Contacts.contactsList.appendChild($tr)
  },

  contactEdit: function (entry) {
    let $tr = document.getElementById('entry-' + entry.id)
    let $td
    let key
    $tr.innerHTML = ''
    for (key in entry) {
      if (entry.hasOwnProperty(key)) {
        $td = document.createElement('td')
        if (key === 'phone') {
          $td.innerHTML = `<span>${key}</span><a href="tel:${entry[key]}">${entry[key]}</a>`
        } else {
          $td.innerHTML = `<span>${key}</span>${entry[key]}`
        }
        $tr.appendChild($td)
      }
    }
    $td = document.createElement('td')
    $td.classList.add('actions')
    $td.innerHTML = `<a class="btn-edit" data-action="edit" data-id="${entry.id}">Edit</a> <a class="btn-remove" data-action="remove" data-id="${entry.id}">Remove</a>`
    $tr.appendChild($td)
  },

  contactRemove: function (entry) {
    Contacts.contactsList.removeChild(document.getElementById('entry-' + entry.id))
  }
}

Contacts.initialize()
