/** @babel */

import { CompositeDisposable } from 'atom';
import TagGenerator from '../tag-generator';
import getTagsFile from '../get-tags-file';

export default class OnFileChangeUpdater {
  constructor() {
    this.toggle(atom.config.get(
      'symbols-view-plus.plusConfigurations.updateProjectTagsOnFileChange'
    ));
    atom.config.observe(
      'symbols-view-plus.plusConfigurations.updateProjectTagsOnFileChange',
      (newValue) => this.toggle(newValue)
    );
  }

  toggle(newVal) {
    newVal ? this.enable() : this.disable();
  }

  enable() {
    if (this.editorsSubscription) { return; }

    this.editorsSubscription = atom.workspace.observeTextEditors((editor) => {

      const initialised = () => getTagsFile(atom.project.getPaths()[0]);

      const generateFileSymbols = () => {
          if(initialised()) {
              const scope =  editor.getGrammar() && editor.getGrammar().scopeName
              new TagGenerator(editor.getPath(),scope).generateFileSymbols();
          }
      }

      const generateProjectSymbols = () => {
          if(tagsInitialised()) {
              new TagGenerator(null).generateProjectSymbols();
          }
      }

      const editorSubscriptions = new CompositeDisposable();
      editorSubscriptions.add(editor.onDidChangeGrammar(generateFileSymbols));
      editorSubscriptions.add(editor.onDidSave(generateFileSymbols));
      editorSubscriptions.add(editor.onDidChangePath(generateProjectSymbols));
      editorSubscriptions.add(editor.getBuffer().onDidReload(generateFileSymbols));
      editorSubscriptions.add(editor.getBuffer().onDidDestroy(generateProjectSymbols));
      editor.onDidDestroy(() => editorSubscriptions.dispose());
    });
  }

  disable() {
    if (this.editorsSubscription) {
      this.editorsSubscription.dispose();
      this.editorsSubscription = null;
    }
  }
}
