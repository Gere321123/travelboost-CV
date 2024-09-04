<template>
  <div>
    <section v-if="editor" class="button-group flex items-center flex-wrap gap-x-4 border border-gray-400 p-4">
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <BoldIcon title="Bold"/>
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <Italic/>
      </button>
      <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
        <FormatUnderline/>
      </button>
      <button type="button" @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <StrikeIcon title="Strike" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        <Heading1Icon title="Heading 1" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <Heading2Icon title="Heading 2" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        <Heading3Icon title="Heading 3" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        <Heading4Icon title="Heading 4" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        <Heading5Icon title="Heading 5" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        <Heading6Icon title="Heading 6" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <OrderedListIcon title="Ordered List" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <BulletListIcon title="Bullet List" />
      </button>
    </section>
    <editor-content class="editor-content" :editor="editor"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import BoldIcon from 'vue-material-design-icons/FormatBold.vue';
import Italic from 'vue-material-design-icons/FormatItalic.vue';
import FormatUnderline from 'vue-material-design-icons/FormatUnderline.vue';
import StrikeIcon from 'vue-material-design-icons/FormatStrikethrough.vue'
import OrderedListIcon from 'vue-material-design-icons/FormatListNumbered.vue'
import BulletListIcon from 'vue-material-design-icons/FormatListBulleted.vue'
import Heading1Icon from 'vue-material-design-icons/FormatHeader1.vue'
import Heading2Icon from 'vue-material-design-icons/FormatHeader2.vue'
import Heading5Icon from 'vue-material-design-icons/FormatHeader5.vue'
import Heading6Icon from 'vue-material-design-icons/FormatHeader6.vue'
import Heading3Icon from 'vue-material-design-icons/FormatHeader3.vue'
import Heading4Icon from 'vue-material-design-icons/FormatHeader4.vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  components: {
    EditorContent,
    BoldIcon,
    Italic,
    FormatUnderline,
    StrikeIcon,
    OrderedListIcon,
    BulletListIcon,
    Heading1Icon,
    Heading2Icon,
    Heading5Icon,
    Heading6Icon,
    Heading3Icon,
    Heading4Icon,
  },
  setup(props, { emit }) {
    const editor = useEditor({
      content: props.modelValue,
      extensions: [StarterKit, Underline, BulletList, ListItem],
      onUpdate({ editor }) {
        emit('update:modelValue', editor.getHTML())
      },
    })

    watch(() => props.modelValue, (newValue) => {
      if (editor.value && editor.value.getHTML() !== newValue) {
        editor.value.commands.setContent(newValue)
      }
    })

    return { editor }
  },
})
</script>


<style scoped>
.editor-content {
  border: 1px solid #cccccc; /* Világosabb szegély */
  border-radius: 10px; /* Lekerekített sarkak */
  padding: 1px 14px; /* Padding belül */
  margin: 18px 4px;
  max-height: 600px; /* Maximális magasság */
  overflow-y: auto; /* Függőleges görgetés */
  background-color: #f9f9f9; /* Háttérszín */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Halvány árnyék */

  &::-webkit-scrollbar {
    width: 6px; /* Scrollbar szélessége */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* Scrollbar háttere */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888; /* Scrollbar hüvelykujja színe */
    border-radius: 3px; /* Scrollbar hüvelykujja lekerekítése */
  }

}

.button-group{
  display: flex;
  justify-content: center;
}
.button-group button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 12px;
  color: #fff;
  background-color: #59595a;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #7a7a7a;
    transform: scale(1.1);
  }
  &.is-active {
    background-color: #fd5252;
  }
}
ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
</style>
