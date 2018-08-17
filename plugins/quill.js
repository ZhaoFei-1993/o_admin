import Vue from 'vue';
import Quill from 'quill';
import undo from '../assets/img/inlineSvg/undo.svg';
import redo from '../assets/img/inlineSvg/redo.svg';

const customFonts = ['Helvetica-Neue', 'Helvetica', 'PingFangSC-Regular', '宋体', '黑体', 'Droid-Sans-Mono', 'Roboto', 'Ubuntu', 'Arial', 'Tahoma', 'Times-New-Roman'];

export default (app, store) => {
  if (process.browser) {
    const Font = Quill.import('formats/font');
    const icons = Quill.import('ui/icons');
    icons['undo'] = undo;
    icons['redo'] = redo;
    Font.whitelist = customFonts;
    Quill.register(Font, true);
    const VueQuillEditor = require('vue-quill-editor/dist/ssr');
    Vue.use(VueQuillEditor, {
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            ['undo', 'redo'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            [{'font': customFonts}],
            [{'align': []}], ['clean'],
            ['link', 'image'],
          ],
          handlers: {
            undo: function (value) {
              this.quill.history.undo();
            },
            redo: function (value) {
              this.quill.history.redo();
            }
          }
        },
        history: {
          delay: 2000,
          maxStack: 500,
          userOnly: true
        }
      },
    });
  }
};
