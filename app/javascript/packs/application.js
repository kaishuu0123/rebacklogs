// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")

import {config, dom, library} from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faColumns } from '@fortawesome/free-solid-svg-icons/faColumns';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons/faBorderAll';
import { faBorderNone } from '@fortawesome/free-solid-svg-icons/faBorderNone';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faGhost } from '@fortawesome/free-solid-svg-icons/faGhost';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip'

import { faMarkdown } from '@fortawesome/free-brands-svg-icons/faMarkdown'

library.add(
  faPlusCircle, faInfoCircle, faInfo, faCheck, faBan,
  faAngleRight, faPen, faDoorOpen, faTimes, faTrashAlt, faComment,
  faSquare, faAngleDoubleLeft, faCog, faUsers, faUser, faUserFriends,
  faColumns, faBorderAll, faBorderNone, faWrench, faGhost,
  faArrowRight, faArrowDown, faClock, faPaperclip,
  faMarkdown
);

dom.i2svg();

import '../stylesheets/application.scss'

import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/tooltip'
import '../src/sb-admin-2.js'

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

import toastr from 'toastr'

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "5000",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

$(function() {
  if ($('.flash').length > 0) {
    const text = $('.flash').text()
    const type = $('.flash').attr('toastr-type')

    toastr[type](text)
  }
})

import 'bootstrap-select'
import bsCustomFileInput from 'bs-custom-file-input'
$(function() {
  bsCustomFileInput.init()
})

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
